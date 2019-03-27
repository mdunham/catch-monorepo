import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.module.link-bank.SyncStatus';

export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
};
// Possible Message States
//
// NOT_STARTED = 0;
// AUTHENTICATING = 1;
// FETCHING_ACCOUNTS = 2;
// FETCHING_HOLDINGS = 3;
// FETCHING_TRANSACTIONS = 4;
// FETCHING_SECURITIES = 5;
// ANALYZING = 6;
// COVERED_ACCOUNT_LOAD = 7;
// COVERED_TRANSACTIONS_LOAD = 8;
// COMPLETED = 9;
export const messageMap = {
  not_started: <FormattedMessage id={`${PREFIX}.notStarted`} />,
  authenticating: <FormattedMessage id={`${PREFIX}.authenticating`} />,
  fetching_accounts: <FormattedMessage id={`${PREFIX}.fetchingAccounts`} />,
  fetching_holdings: <FormattedMessage id={`${PREFIX}.fetchingHoldings`} />,
  fetching_securities: <FormattedMessage id={`${PREFIX}.fetchingSecurities`} />,
  analyzing: <FormattedMessage id={`${PREFIX}.analyzing`} />,
};

export const DEFAULT_MESSAGE = <FormattedMessage id={`${PREFIX}.default`} />;
export function toHumanMessage(sync) {
  if (sync.syncProgressMessage === '') return DEFAULT_MESSAGE;
  const msg = messageMap[sync.syncProgressMessage.toLowerCase()];
  if (msg) return msg;
  return DEFAULT_MESSAGE;
}

export function toHumanError(sync) {
  const error = ERROR_COPY[sync.syncStatus];
  if (error) return error;
  return ERROR_COPY['DEFAULT_ERROR'];
}

// Error Statuses are the hard coded string error codes that indicate that we
// need to go through another round of authentication with the user.  Whether
// it's because they mistyped a password or their banking institution requires
// more complex authentication.
const ERROR_STATUSES = [
  'PENDING', // Quovo is overloaded and we need to bail and check later
  'LOGIN_ERROR', // mistyped password/username
  'CHALLENGE_ERROR', // bank requires challenges
  'SYSTEM_ERROR', // some sort of internal Quovo error
  'CONFIG_ERROR', // user needs to take action on their end
  'NO_ACCOUNTS_ERROR', // no portfolios for the account they created
];

export const ERROR_COPY = {
  DEFAULT_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.defaultError.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.defaultError.caption`} />,
  },
  LOGIN_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.defaultError.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.loginError.caption`} />,
  },
  CHALLENGE_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.challengeError.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.challengeError.caption`} />,
  },
  SYSTEM_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.defaultError.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.systemError.caption`} />,
  },
  CONFIG_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.defaultError.title`} />,
    caption: values => (
      <FormattedMessage id={`${PREFIX}.configError.caption`} values={values} />
    ),
  },
  NO_ACCOUNTS_ERROR: {
    title: <FormattedMessage id={`${PREFIX}.defaultError.title`} />,
    caption: <FormattedMessage id={`${PREFIX}.noAccountsError.caption`} />,
  },
};

export function isSyncError(sync) {
  return !!sync && ERROR_STATUSES.includes(sync.syncStatus);
}

export function isSynced(sync) {
  return !!sync && sync.syncStatus === 'GOOD';
}

export function toPercentComplete(sync) {
  return sync.percentComplete;
}

export function needsBankName(msg) {
  return typeof msg === 'function';
}
