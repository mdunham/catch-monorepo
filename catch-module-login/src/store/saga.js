import React from 'react';
import { delay } from 'redux-saga';
import {
  takeEvery,
  call,
  take,
  fork,
  all,
  put,
  select,
  spawn,
} from 'redux-saga/effects';
import { reset, untouch } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { postToHubspot } from '@catch/common';
import { popErrorToast, popToast, errorMsg } from '@catch/errors';
import {
  toGQLDate,
  Auth,
  Env,
  createLogger,
  trackIntercom,
  Currency,
  bottomTabs,
  login,
  Segment,
} from '@catch/utils';

import { navigate } from '../navigation';
import { signApolloIn, signApolloOut } from '@catch/apollo';
import { constants as at, actions } from './duck';
import * as Api from './endpoints';
import * as sel from './selectors';

const DEFAULT_REDIRECT = '/';
const Log = createLogger('auth-saga');

const PREFIX = 'catch.module.login';
const COPY = {
  giftTitle: values => (
    <FormattedMessage id={`${PREFIX}.GiftToast.title`} values={values} />
  ),
  giftMsg: values => (
    <FormattedMessage id={`${PREFIX}.GiftToast.msg`} values={values} />
  ),
};

export function* signIn({
  payload: {
    values: { email, password },
    next,
  },
}) {
  try {
    yield call(
      authenticate,
      // Enforce lowercase
      {
        email: email.toLowerCase(),
        password,
      },
    );
    yield call(checkAuthStatus, { payload: { next } });
  } catch (e) {
    if (e.code === 'UserNotConfirmedException') {
      // Resends a code by default so they don't need to dig too far
      yield call(Auth.resendAuthCode, email);
      yield put(actions.failedAuth(e.code, { email }));
      // This cleans validation checks
      yield put(untouch('SignInForm', 'email', 'password'));
      yield call(confirmAndCreateUser, { email, password });
    } else {
      Log.error(e);
      yield put(actions.failedAuth(e.code, { email }));
      // This cleans validation checks
      yield put(untouch('SignInForm', 'email', 'password'));
    }
  }
}

export function* signUp({ payload: { email, password } }) {
  let authAttributes;
  let user;

  try {
    Log.debug('creating user in cognito');
    authAttributes = {
      // Enforce lowercase
      email: email.toLowerCase(),
      password,
    };
    Log.debug(authAttributes);
    user = yield call(Auth.signUp, authAttributes);
  } catch (e) {
    Log.error(e);

    if (e.code === 'UsernameExistsException') {
      Log.debug('redirecting to /auth/sign-in');
      /**
       * @NOTE: navigate is a redux action in web so we use `put` effect
       */
      if (Env.isNative) {
        try {
          const componentId = yield select(sel.getNavId);
          Log.debug(componentId);
          yield call(navigate, { route: `/auth/sign-in`, componentId });
        } catch (e) {
          Log.debug(e);
          return;
        }
      } else {
        yield put(navigate('/auth/sign-in'));
      }
    }
    yield put(actions.failedAuth(e.code));
    return;
  }

  Log.debug(user);
  /**
   * At this point the user is not confirmed or existing at all in our db
   * however we want to ensure we record the referrer before they drop out
   * pageView is necessary for hubspot to actually send the data
   */
  Segment.identifyUser(null, authAttributes.email, {
    referral_link: document.referrer,
    initial_user: true,
  });
  Segment.pageView();

  // Pause until validated email address.
  if (!user.userConfirmed) {
    yield put(actions.registeredUser(email));
    yield call(waitUntilConfirmed, authAttributes.email);
  }

  let credentials;
  try {
    credentials = yield call(Auth.signIn, {
      email: authAttributes.email,
      password,
    });
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
    return;
  }

  yield call(signApolloIn);
  yield put(actions.confirmedUser());
}

export function* signOut({ payload: { email } }) {
  try {
    yield call(Auth.signOut);
  } catch (e) {
    Log.error(e);
  }
  if (!Env.isNative) {
    yield call(signApolloOut);
  }

  if (email) {
    if (!Env.isNative) yield put(navigate('/auth/refresh'));
  } else {
    if (Env.isNative) {
      yield call(navigate, { route: login });
      // In native we clean apollo after we navigate else it creates
      // errors where the data becomes undefined in rendered views
      yield call(signApolloOut);
    }
    Log.debug('Successfully logged out');
  }
}

export function* requestResetPassword({ payload: { email } }) {
  try {
    yield call(Auth.forgotPassword, email);
    yield put(actions.requestedReset());
    if (Env.isNative) {
      const componentId = yield select(sel.getNavId);
      yield call(navigate, {
        route: '/auth/forgot-password/confirm',
        componentId,
      });
    } else {
      yield put(navigate('/auth/forgot-password/confirm'));
    }
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth(e.code));
  }
}

export function* confirmResetPassword({ payload: { newPassword, code } }) {
  const email = yield select(sel.getPWRequestEmail);
  if (!email) {
    yield put(actions.failedAuth('NoEmailPasswordResetError'));
    if (Env.isNative) {
      const componentId = yield select(sel.getNavId);
      yield call(navigate, { route: '/auth/forgot-password', componentId });
    } else {
      yield put(navigate('/auth/forgot-password'));
    }
    return;
  }
  try {
    yield call(Auth.confirmForgotPassword, { email, newPassword, code });
    yield call(authenticate, { email, password: newPassword });
    yield call(checkAuthStatus, { payload: {} });
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth(e.code));
  }
}

export function* resendAuthCode({ payload: { email } }) {
  try {
    yield call(Auth.resendAuthCode, email);
    yield put(actions.codeSent());
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
  }
}

// -------------
// Utility Sagas
// -------------

// waitUntilConfirmed is a recursive saga that keeps prompting use for a valid
// email verification code.  Whenever using the saga ensure the user has the
// ability to request a new code so they don't get stuck in the application.
function* waitUntilConfirmed(email) {
  Log.debug(`user's email unconfirmed, waiting for valid token`);
  const {
    payload: { code },
  } = yield take(at.USER_CONFIRM);
  try {
    yield call(Auth.confirmSignUp, { email, code });

    Log.debug('user email token confirmed');
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
    if (e.code === 'CodeMismatchException') {
      yield put(reset('ConfirmationCodeForm'));
      yield put(actions.confirmUser());
      yield put(actions.failedAuth(e.code));
    }
    return yield call(waitUntilConfirmed, email);
  }
}

function* handleNewUserAnalytics() {
  try {
    yield call(trackIntercom, ('Is User', true));
  } catch (e) {
    Log.error('failed to handle user analytics');
  }
}

// confirmAndCreateUser waits until they have a valid email and then creates the auth
// providers user in our system with the correct metadata.
function* confirmAndCreateUser({ email, password }) {
  yield put(actions.registeredUser(email));
  if (Env.isNative) {
    const componentId = yield select(sel.getNavId);
    yield call(navigate, { route: `/auth/sign-up`, componentId });
  } else {
    yield put(navigate(`/auth/sign-up`));
  }
  // As we navigate out of the sign in view we reset any error state
  yield put(actions.clearError());
  yield call(waitUntilConfirmed, email);
  let credentials;
  try {
    credentials = yield call(Auth.signIn, {
      email,
      password,
    });
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
    return;
  }

  yield call(signApolloIn);
  yield put(actions.confirmedUser());
}

// createInternalUser creates a clone of our user from Cognito in our own managed
// user service.
export function* createInternalUser({
  payload: { givenName, familyName, dob, signupCode },
}) {
  let attributes;
  try {
    const user = yield call(Auth.currentProviderUser);
    attributes = yield call(Auth.getUserAttributes, user);
  } catch (e) {
    Log.error(e);
  }
  Log.debug(attributes);
  const email = attributes.email;

  try {
    Log.debug(givenName);
    Log.debug('creating internal user');
    Log.debug(signupCode);
    const {
      data: {
        createUser: { id },
      },
    } = yield call(Api.createUser, {
      givenName,
      familyName,
      email,
      dob: toGQLDate(dob),
      signupCode,
    });
    Segment.identifyUser(id, email, {
      firstname: givenName,
      lastname: familyName,
      coupon_code: signupCode,
    });
    Segment.userCreated(email);

    Log.debug('created internal user');
    yield put(actions.createdUser({ email, givenName }));
    if (signupCode) {
      const verifiedCode = yield call(handleSignupCode, { signupCode });
    }
    yield call(handleNewUserAnalytics);
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
  }
}

// The user confirmed through cognito but was never created in our system
function* createConfirmedUser({ email }) {
  const user = yield call(Auth.currentProviderUser);
  const attributes = yield call(Auth.getUserAttributes, user);
  yield call(createInternalUser, { email, ...attributes });
}

// authenticate signs the user into our auth provider to get a JWT token and
// then sets that in our redux store so the UI can act accordingly.
function* authenticate({ email, password }) {
  const credentials = yield call(Auth.signIn, { email, password });
  yield call(signApolloIn);
}

export function* handleSignupCode({ signupCode }) {
  try {
    Log.debug('validating signup code');
    Log.debug(signupCode);
    const {
      data: {
        validateCode: { reward, valid },
      },
    } = yield call(Api.validateCode, { signupCode });
    Log.debug(reward);
    if (valid) {
      yield put(
        popToast({
          type: 'gift',
          title: COPY['giftTitle']({
            amount: <Currency>{reward.amount}</Currency>,
          }),
          msg: COPY['giftMsg']({
            amount: <Currency>{reward.amount}</Currency>,
          }),
        }),
      );
      return signupCode;
    } else {
      Log.debug('code invalid');
    }
  } catch (e) {
    Log.error(e);
  }
}

// warmCurrentUserCache does some fetching of resources to enhance the UX when
// users are finally authenticated.
function* warmCurrentUserCache() {
  try {
    yield all([
      call(Api.fetchCurrentUser),
      // Banks can take forever to load, just grab em on signIn for better
      // linking UX.
      call(Api.fetchBanks),
    ]);
  } catch (e) {
    Log.error(e.message);
  }
}

export function* checkAuthStatus({ payload }) {
  let credentials;
  try {
    credentials = yield call(Auth.getCredentials);
    Log.debug('User is authenticated via cognito');
  } catch (e) {
    Log.error(e);
    // if we can't find the user we start the signup flow
    yield put(actions.startOnboarding());
    return;
  }
  try {
    const {
      data: { viewer },
    } = yield call(Api.checkUserExists);
    Log.debug(viewer);
    // Users has already provided all their info we should make sure we're never
    // on this flow again. Redirect anywhere if necessary
    if (typeof viewer.incomeState === 'string') {
      // We pass the givenName here to cache it and display it on refresh
      yield put(
        actions.authenticate({ credentials, givenName: viewer.user.givenName }),
      );
      if (!Env.isNative) {
        if (payload && payload.next) {
          yield put(navigate(payload.next));
        } else {
          yield put(navigate(DEFAULT_REDIRECT));
        }
      } else {
        Segment.identifyUser(viewer.user.id, viewer.user.email);
        yield call(navigate, { route: bottomTabs });
      }
      yield put(reset('SignInForm'));
    } else {
      // Pass some user context fields that might be used in the UI
      const userContext = {
        givenName: viewer.user.givenName,
        familyName: viewer.user.familyName,
        email: viewer.user.email,
        workType: viewer.user.workType,
      };
      // makes sure we're on the sign-up route
      // native does not require navigation
      if (!Env.isNative) {
        yield put(navigate('/auth/sign-up'));
      }
      if (userContext.workType) {
        yield put(actions.completedWorkType(userContext));
      } else {
        yield put(actions.createdUser(userContext));
      }
    }
  } catch (e) {
    Log.debug('User does not exist in graphql');
    // User is authenticated but does not exist in our database we go to
    // the creation step
    if (Env.isNative) {
      const componentId = yield select(sel.getNavId);
      yield call(navigate, { route: `/auth/sign-up`, componentId });
    } else {
      yield put(navigate(`/auth/sign-up`));
    }
    yield put(actions.confirmedUser());
  }
}
export function* sendWorkTypeToHubspot({
  payload: {
    userContext: { workType },
  },
}) {
  const WORK_TYPES = {
    WORK_TYPE_W2: '_full_time_employee',
    WORK_TYPE_1099: 'freelancer/contractor',
    WORK_TYPE_DIVERSIFIED: 'mixed_job_types',
  };
  const context = yield select(sel.getUserContext);
  try {
    const endpoint = `contacts/v1/contact/createOrUpdate/email/${
      context.email
    }/`;

    const payload = [
      {
        property: 'employment_status',
        value: WORK_TYPES[workType],
      },
    ];
    yield call(postToHubspot, { endpoint, payload });
  } catch (e) {
    Log.debug(e);
  }
}
/**
 * This helps creating a user without going through the entire flow
 * feel free to customize if you need other stuff to happen automatically
 */
export function* testUser({
  payload: {
    values: {
      email,
      password,
      givenName,
      familyName,
      dob,
      estimated1099Income,
      estimatedW2Income,
      employerName,
      spouseIncome,
      residenceState,
      workState,
      filingStatus,
      workType,
    },
  },
}) {
  let user;
  try {
    user = yield call(Auth.signUp, {
      email: email.toLowerCase(),
      password,
    });
  } catch (e) {
    Log.error(e);
    return;
  }
  yield put(actions.registeredUser(email));
  if (Env.isNative) {
    const componentId = yield select(sel.getNavId);
    yield call(navigate, { route: `/auth/sign-up`, componentId });
  } else {
    yield put(navigate(`/auth/sign-up`));
  }
  yield call(waitUntilConfirmed, email);
  let credentials;
  try {
    credentials = yield call(Auth.signIn, {
      email,
      password,
    });
  } catch (e) {
    Log.error(e);
    yield put(actions.failedAuth());
    return;
  }
  yield call(signApolloIn);
  try {
    const user = yield call(Api.createUser, {
      givenName,
      familyName,
      email,
      dob: toGQLDate(dob),
      residenceState,
    });
    Log.info(user);
  } catch (e) {
    Log.debug(e);
  }
  try {
    const userInfo = yield call(Api.updateUserMetadata, {
      workType,
      workState,
      estimated1099Income,
      estimatedW2Income,
      spouseIncome,
      filingStatus,
      employerName,
    });
    Log.info(userInfo);
  } catch (e) {
    Log.debug(e);
  }
  yield put(actions.authenticate({ credentials, givenName }));
  yield put(navigate(DEFAULT_REDIRECT));
}

export default function* rootSaga() {
  yield all([
    fork(takeEvery, at.SIGN_IN, signIn),
    fork(takeEvery, at.SIGN_OUT, signOut),
    fork(takeEvery, at.REQUEST_RESET, requestResetPassword),
    fork(takeEvery, at.CONFIRM_RESET, confirmResetPassword),
    fork(takeEvery, at.CODE_RESEND, resendAuthCode),
    fork(takeEvery, at.TEST_SIGN_UP, testUser),
    fork(takeEvery, at.USER_REGISTER, signUp),
    fork(takeEvery, at.USER_CREATE, createInternalUser),
    fork(takeEvery, at.AUTH_STATUS, checkAuthStatus),
    fork(takeEvery, at.USER_WORKTYPE, sendWorkTypeToHubspot),
  ]);
}
