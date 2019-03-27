import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';
import { takeEvery, call, fork, all, put } from 'redux-saga/effects';
import { reset } from 'redux-form';
import { popErrorToast, popToast, errorMsg } from '@catch/errors';
import { Auth, createLogger } from '@catch/utils';

import { actions, constants as at } from './duck';
import { updateUserEmail } from './endpoints';

const Log = createLogger('user-saga');
// Importing it from ChangeEmail creates issues so just dumping this here
const PREFIX = 'catch.module.me.ChangeCredentials';
export const COPY = {
  'emailSuccessToast.title': (
    <FormattedMessage id={`${PREFIX}.emailSuccessToast.title`} />
  ),
  'emailSuccessToast.msg': values => (
    <FormattedMessage id={`${PREFIX}.emailSuccessToast.msg`} values={values} />
  ),
  'passwordSuccessToast.title': (
    <FormattedMessage id={`${PREFIX}.passwordSuccessToast.title`} />
  ),
};

export function* changePassword({ payload: { oldPassword, newPassword } }) {
  try {
    yield call(Auth.changePassword, { oldPassword, newPassword });
    yield put(reset('ChangePasswordForm'));
    yield put(
      popToast({ type: 'success', title: COPY['passwordSuccessToast.title'] }),
    );
    yield put(actions.changedPassword());
    yield put(reset('ChangePasswordForm'));
  } catch (e) {
    // TODO: error message
    Log.error(e);
    yield put(actions.failedPassword());
  }
}

export function* changeEmail({ payload: { email } }) {
  try {
    yield call(Auth.changeEmail, { email });
    yield put(reset('ChangeEmailForm'));
    Log.debug('Email request sent');
    yield put(actions.changedEmail());
  } catch (e) {
    Log.error(e);
    yield put(actions.failedEmail());
  }
}

export function* confirmEmail({ payload: { code, email, callback } }) {
  try {
    yield call(Auth.confirmEmail, { code });
    Log.debug('user email change confirmed');
    yield call(updateUserEmail, { email });
    yield put(actions.confirmedEmail());
    if (Platform.OS === 'web') {
      yield put(actions.toggleModal());
    }
    yield put(
      popToast({
        type: 'success',
        title: COPY['emailSuccessToast.title'],
        msg: COPY['emailSuccessToast.msg']({ email }),
      }),
    );
    yield call(callback);
  } catch (e) {
    Log.error(e);
    yield put(actions.failedEmailConfirmation());
  }
}

export default function* rootSaga() {
  yield all([
    fork(takeEvery, at.PASSWORD_REQUEST, changePassword),
    fork(takeEvery, at.EMAIL_REQUEST, changeEmail),
    fork(takeEvery, at.CODE_REQUEST, confirmEmail),
  ]);
}
