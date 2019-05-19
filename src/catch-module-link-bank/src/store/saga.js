import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  takeEvery,
  fork,
  take,
  race,
  all,
  call,
  put,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { push, getLocation } from 'react-router-redux';
import { reset } from 'redux-form';

import { popErrorToast, popToast, errorMsg } from '@catch/errors';
import { accountRef, createLogger, Env, mins } from '@catch/utils';
import { postToHubspot } from '@catch/common';

import { actions, constants as at } from './duck';
import { isLoginError, isAlreadyLinked, shouldTryAgain } from './model';
import * as Api from './endpoints';

const Log = createLogger('link-saga');
const PREFIX = 'catch.module.link-bank.saga';
export const COPY = {
  'linkBank.successToast.title': (
    <FormattedMessage id={`${PREFIX}.linkBank.successToast.title`} />
  ),
  'linkBank.successToast.msg': (
    <FormattedMessage id={`${PREFIX}.linkBank.successToast.msg`} />
  ),
  'setPrimaryAccount.successToast.title': (
    <FormattedMessage id={`${PREFIX}.setPrimaryAccount.successToast.title`} />
  ),
  'setPrimaryAccount.successToast.msg': values => (
    <FormattedMessage
      id={`${PREFIX}.setPrimaryAccount.successToast.msg`}
      values={values}
    />
  ),
};

// values: { username, password, bankId }
function* linkBank({ payload: { values } }) {
  Log.debug(values);
  try {
    Log.debug('creating bank link');
    const { created } = yield race({
      cancelled: take(at.RESET),
      created: call(Api.createBankLink, values),
    });

    if (created) {
      Log.debug('created bank link');
      yield call(handleSuccess, created);
      return;
    } else {
      Log.debug('bailed the bank link');
      // bail out of saga
      yield put(reset('BankLoginForm'));
      return;
    }
  } catch (e) {
    Log.error(e);
    if (isAlreadyLinked(e.message)) {
      //TODO handle this error case properly
    } else {
      yield put(reset('BankLoginForm'));
      yield put(actions.failedRequest());
    }
  }
}

function* updateLink({ payload: { values } }) {
  Log.debug(values);
  try {
    Log.debug('updating bank link');
    const { updated } = yield race({
      cancelled: take(at.RESET),
      updated: call(Api.updateBankLink, values),
    });

    if (updated) {
      Log.debug('updated bank link');
      yield call(handleSuccess, updated);
    } else {
      Log.debug('bailed the bank link');
      // bail out of saga
      yield put(reset('BankLoginForm'));
      return;
    }
  } catch (e) {
    Log.error(e);
    if (isAlreadyLinked(e.message)) {
      //TODO handle this error case properly
    } else {
      yield put(reset('BankLoginForm'));
      yield put(actions.failedRequest());
    }
  }
}

function* setPrimaryAccount({ payload: { accountId } }) {
  Log.debug('Setting primary account ' + accountId);
  try {
    const { name, accountNumber } = yield call(Api.setPrimaryAccount, {
      accountId,
    });
    Log.debug('Successfully set primary account');
    yield put(actions.setPrimaryAccount());
  } catch (e) {
    Log.error(e);
    yield put(actions.failedRequest());
  }
}

function* handleSuccess(link) {
  yield put(actions.createdLink(link.id));

  // f we restart a sync or decide to update a link
  const { timeout, finish, restart } = yield race({
    finish: take(at.FINISH_LINK),
    restart: take(at.UPDATE_LINK),
    timeout: delay(mins(8)),
  });
  if (finish) {
    Log.debug('finished');

    const payload = [
      {
        property: 'linked_bank',
        value: true,
      },
    ];

    yield call(postToHubspot, { endpoint: 'CREATE_OR_UPDATE', payload });

    yield put(reset('BankLoginForm'));
    yield take(at.SET_PRIMARY_ACCOUNT);
    return;
  }

  if (restart) {
    return;
  }
}

export default function* rootSaga() {
  yield all([fork(takeEvery, at.START_LINK, linkBank)]);
  yield all([fork(takeEvery, at.UPDATE_LINK, updateLink)]);
  yield all([fork(takeEvery, at.SELECT_PRIMARY, setPrimaryAccount)]);
}
