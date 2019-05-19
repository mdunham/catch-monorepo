import { combineActions, handleActions, createAction } from 'redux-actions';

// Constants
export const NAME = 'authentication';
export const AUTHENTICATE = `covered/${NAME}/AUTHENTICATE`;
export const SIGN_IN = `covered/${NAME}/SIGN_IN`;
export const SIGN_OUT = `covered/${NAME}/SIGN_OUT`;
export const SIGN_UP = `covered/${NAME}/SIGN_UP`;
export const FAILED_AUTH = `covered/${NAME}/FAILED_AUTH`;
export const REQUEST_RESET = `covered/${NAME}/REQUEST_RESET`;
export const REQUESTED_RESET = `covered/${NAME}/REQUESTED_RESET`;
export const CONFIRM_RESET = `covered/${NAME}/CONFIRM_RESET`;
export const CONFIRM_CODE = `covered/${NAME}/CONFIRM_CODE`;
export const CODE_RESEND = `covered/${NAME}/CODE_RESEND`;
export const CODE_RESENT = `covered/${NAME}/CODE_RESENT`;
export const USER_SUCCESS = `covered/${NAME}/USER_SUCCESS`;
export const TEST_SIGN_UP = `covered/${NAME}/TEST_SIGN_UP`;
export const CACHE_SIGNUP_CODE = `covered/${NAME}/CACHE_SIGNUP_CODE`;
export const USER_REGISTER = `covered/${NAME}/USER_REGISTER`;
export const USER_REGISTERED = `covered/${NAME}/USER_REGISTERED`;
export const USER_CREATE = `covered/${NAME}/USER_CREATE`;
export const USER_CREATED = `covered/${NAME}/USER_CREATED`;
export const USER_CONFIRM = `covered/${NAME}/USER_CONFIRM`;
export const USER_CONFIRMED = `covered/${NAME}/USER_CONFIRMED`;
export const USER_WORKTYPE = `covered/${NAME}/USER_WORKTYPE`;
export const USER_INFO = `covered/${NAME}/USER_INFO`;
export const USER_COMPLETED = `covered/${NAME}/USER_COMPLETED`;
export const AUTH_STATUS = `covered/${NAME}/AUTH_STATUS`;
export const USER_START = `covered/${NAME}/USER_START`;
export const CLEAR_ERROR = `covered/${NAME}/CLEAR_ERROR`;
export const SAVE_NAV_ID = `covered/${NAME}/SAVE_NAV_ID`;

export const constants = {
  NAME,
  AUTHENTICATE,
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
  FAILED_AUTH,
  REQUEST_RESET,
  REQUESTED_RESET,
  CONFIRM_RESET,
  CONFIRM_CODE,
  CODE_RESEND,
  CODE_RESENT,
  TEST_SIGN_UP,
  USER_START,
  USER_REGISTER,
  USER_REGISTERED,
  USER_CREATE,
  USER_CREATED,
  USER_CONFIRM,
  USER_CONFIRMED,
  USER_WORKTYPE,
  USER_INFO,
  USER_COMPLETED,
  AUTH_STATUS,
  CLEAR_ERROR,
  SAVE_NAV_ID,
};

// Action Creators
export const actions = {
  authenticate: createAction(AUTHENTICATE),
  signIn: createAction(SIGN_IN),
  signOut: createAction(SIGN_OUT, userInfo => ({
    email: userInfo ? userInfo.email : undefined,
    givenName: userInfo ? userInfo.givenName : undefined,
  })),
  signUp: createAction(SIGN_UP),
  failedAuth: createAction(FAILED_AUTH, (msg, context) => ({ msg, context })),
  requestReset: createAction(REQUEST_RESET, email => ({ email })),
  requestedReset: createAction(REQUESTED_RESET),
  confirmReset: createAction(CONFIRM_RESET, ({ newPassword, code }) => ({
    newPassword,
    code,
  })),
  resendEmail: createAction(CODE_RESEND, email => ({ email })),
  codeSent: createAction(CODE_RESENT),
  confirmCode: createAction(CONFIRM_CODE, code => ({ code })),
  userSuccess: createAction(USER_SUCCESS),
  testSignUp: createAction(TEST_SIGN_UP),
  cacheSignupCode: createAction(CACHE_SIGNUP_CODE, code => ({ code })),
  registerUser: createAction(USER_REGISTER),
  registeredUser: createAction(USER_REGISTERED, email => ({ email })),
  createUser: createAction(USER_CREATE),
  createdUser: createAction(USER_CREATED, userContext => ({ userContext })),
  confirmUser: createAction(USER_CONFIRM),
  confirmedUser: createAction(USER_CONFIRMED),
  saveUserInfo: createAction(USER_INFO),
  completedWorkType: createAction(USER_WORKTYPE, userContext => ({
    userContext,
  })),
  completedUser: createAction(USER_COMPLETED),
  checkAuthStatus: createAction(AUTH_STATUS),
  startOnboarding: createAction(USER_START),
  clearError: createAction(CLEAR_ERROR),
  saveNavId: createAction(SAVE_NAV_ID),
};

export const onboardingSteps = {
  REGISTER: 'user-register',
  CONFIRM: 'user-confirm',
  CREATE: 'user-create',
  WORKTYPE: 'user-workType',
  INFO: 'user-info',
  COMPLETE: 'user-complete',
};

// Reducer
export const defaultState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isResendingCode: false,
  resentCode: false,
  // Used for the refresh when auto logged out
  lastSignInEmail: '',
  lastSignInGivenName: '',
  pwRequestEmail: '',
  userSuccess: false,
  error: null,
  code: null,
  signupCode: null,
  signupStep: null,
  userContext: {},
};

// combineActions(SIGN_UP, SIGN_IN)
export default handleActions(
  {
    [CONFIRM_CODE]: (state, { payload: { code } }) => ({
      ...state,
      isAuthenticating: true,
      code,
    }),
    [combineActions(TEST_SIGN_UP, SIGN_IN)]: (
      state,
      {
        payload: {
          values: { email },
        },
      },
    ) => ({
      ...state,
      isAuthenticating: true,
      lastSignInEmail: email,
    }),
    [AUTHENTICATE]: (state, { payload: { credentials, givenName } }) => ({
      ...state,
      lastSignInGivenName: givenName,
      isAuthenticated: true,
      isAuthenticating: false,
      error: null,
    }),
    [SIGN_OUT]: (state, { payload: { email, givenName } }) => ({
      ...defaultState,
      pushToken: state.pushToken,
      lastSignInEmail: email || state.lastSignInEmail,
      lastSignInGivenName: givenName || state.lastSignInGivenName,
    }),
    [FAILED_AUTH]: (state, { payload: { msg, context } }) => ({
      ...state,
      isAuthenticating: false,
      isAuthenticated: false,
      isProcessing: false,
      error: msg || 'Error',
      userContext: {
        ...state.userContext,
        ...(context || {}),
      },
    }),
    [REQUEST_RESET]: (state, { payload: { email } }) => ({
      ...state,
      pwRequestEmail: email,
      isProcessing: true,
    }),
    [REQUESTED_RESET]: state => ({
      ...state,
      isProcessing: false,
    }),
    [CONFIRM_RESET]: state => ({
      ...state,
      isAuthenticating: true,
    }),
    [USER_SUCCESS]: state => ({
      ...state,
      userSuccess: true,
    }),
    [CODE_RESEND]: state => ({
      ...state,
      error: null,
      isResendingCode: true,
    }),
    [CODE_RESENT]: state => ({
      ...state,
      isResendingCode: false,
      resentCode: true,
    }),
    [CACHE_SIGNUP_CODE]: (state, { payload: { code } }) => ({
      ...state,
      signupCode: code,
    }),
    [USER_START]: state => ({
      ...state,
      signupStep: onboardingSteps.REGISTER,
    }),
    // These are just used to trigger our sagas
    [combineActions(
      USER_REGISTER,
      USER_CREATE,
      USER_CONFIRM,
      USER_INFO,
    )]: state => ({
      ...state,
      isProcessing: true,
    }),
    [USER_REGISTERED]: (state, { payload: { email } }) => ({
      ...state,
      userContext: {
        ...state.userContext,
        email,
      },
      isProcessing: false,
      signupStep: onboardingSteps.CONFIRM,
    }),
    [USER_CREATED]: (state, { payload: { userContext } }) => ({
      ...state,
      userContext: {
        ...state.userContext,
        ...userContext,
      },
      isProcessing: false,
      isAuthenticating: false,
      signupStep: onboardingSteps.WORKTYPE,
    }),
    [USER_CONFIRMED]: state => ({
      ...state,
      isAuthenticating: false,
      isProcessing: false,
      signupStep: onboardingSteps.CREATE,
    }),
    [USER_WORKTYPE]: (state, { payload: { userContext } }) => ({
      ...state,
      userContext: {
        ...state.userContext,
        ...userContext,
      },
      signupStep: onboardingSteps.INFO,
    }),
    [USER_COMPLETED]: state => ({
      ...state,
      isProcessing: false,
      signupStep: onboardingSteps.COMPLETE,
    }),
    [CLEAR_ERROR]: state => ({
      ...state,
      error: null,
    }),
    [SAVE_NAV_ID]: (state, { payload: { componentId } }) => ({
      ...state,
      componentId,
    }),
  },
  defaultState,
);
