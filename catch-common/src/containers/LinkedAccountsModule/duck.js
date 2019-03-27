import { createAction, handleActions } from 'redux-actions';

export const LINKED_ACCOUNTS = 'linkedAccounts';
const DELETED_BANK_LINK = `@@${LINKED_ACCOUNTS}/DELETED_BANK_LINK`;
const FAILED_DELETE_BANK_LINK = `@@${LINKED_ACCOUNTS}/FAILED_DELETE_BANK_LINK`;
const DID_SET_PRIMARY_ACCOUNT = `@@${LINKED_ACCOUNTS}/DID_SET_PRIMARY_ACCOUNT`;
const FAILED_SET_PRIMARY_ACCOUNT = `@@${
  LINKED_ACCOUNTS
}/FAILED_SET_PRIMARY_ACCOUNT`;

export const constants = {
  LINKED_ACCOUNTS,
  DELETED_BANK_LINK,
  FAILED_DELETE_BANK_LINK,
  DID_SET_PRIMARY_ACCOUNT,
  FAILED_SET_PRIMARY_ACCOUNT,
};

export const actions = {
  deletedBankLink: createAction(DELETED_BANK_LINK, data => ({ data })),
  failedDeleteBankLink: createAction(FAILED_DELETE_BANK_LINK, errMsg => ({
    errMsg,
  })),
  didSetPrimaryAccount: createAction(DID_SET_PRIMARY_ACCOUNT, data => ({
    data,
  })),
  failedSetPrimaryAccount: createAction(FAILED_SET_PRIMARY_ACCOUNT, errMsg => ({
    errMsg,
  })),
};

const defaultState = {
  bankLinks: null,
  primaryBankLink: null,
};

export default handleActions(
  {
    [DELETED_BANK_LINK]: (state, { payload: { data } }) => ({
      ...state,
      bankLink: null,
    }),
    [DID_SET_PRIMARY_ACCOUNT]: (state, { payload: { data } }) => ({
      ...state,
    }),
  },
  defaultState,
);
