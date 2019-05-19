import { createAction, handleActions } from 'redux-actions';
import { shouldTryAgain } from './model';

// Constants
export const NAME = 'linkBank';
export const CREATED_LOGIN = `covered/${NAME}/CREATED_LOGIN`;
export const FAILED_LINK = `covered/${NAME}/FAILED_LINK`;
export const FINISH_LINK = `covered/${NAME}/FINISH_LINK`;
export const GOTO = `covered/${NAME}/GOTO`;
export const RESET = `covered/${NAME}/RESET`;
export const RETRY_LINK = `covered/${NAME}/RETRY_LINK`;
export const SELECT_LINK = `covered/${NAME}/SELECT_LINK`;
export const SELECT_BANK = `covered/${NAME}/SELECT_BANK`;
export const SELECT_PRIMARY = `covered/${NAME}/SELECT_PRIMARY`;
export const SET_PRIMARY_ACCOUNT = `covered/${NAME}/SET_PRIMARY_ACCOUNT`;
export const START_LINK = `covered/${NAME}/START_LINK`;
export const UPDATE_LINK = `covered/${NAME}/UPDATE_LINK`;
export const CACHE_NEXT_ROUTE = `covered/${NAME}/CACHE_NEXT_ROUTE`;
export const FAILED_REQUEST = `covered/${NAME}/FAILED_REQUEST`;

export const STAGES = {
  selecting: 'selecting',
  fillingIn: 'fillingIn',
  syncing: 'syncing',
  challenging: 'challenging',
  primarySelection: 'primarySelection',
  complete: 'complete',
};

export const constants = {
  CREATED_LOGIN,
  FAILED_LINK,
  FINISH_LINK,
  GOTO,
  NAME,
  RESET,
  RETRY_LINK,
  SELECT_LINK,
  SELECT_BANK,
  SELECT_PRIMARY,
  STAGES,
  START_LINK,
  UPDATE_LINK,
  SET_PRIMARY_ACCOUNT,
  CACHE_NEXT_ROUTE,
  FAILED_REQUEST,
};

// Action Creators
export const actions = {
  selectLink: createAction(SELECT_LINK, linkId => ({ linkId })),
  updateLink: createAction(UPDATE_LINK),
  createdLink: createAction(CREATED_LOGIN, linkId => ({ linkId })),
  failedLink: createAction(FAILED_LINK, errorStatus => ({ errorStatus })),
  finishLink: createAction(FINISH_LINK),
  goTo: createAction(GOTO, stage => ({ stage })),
  reset: createAction(RESET),
  retryLink: createAction(RETRY_LINK),
  selectBank: createAction(SELECT_BANK, bank => ({ bank })),
  selectPrimaryAccount: createAction(SELECT_PRIMARY, accountId => ({
    accountId,
  })),
  startLink: createAction(START_LINK),
  setPrimaryAccount: createAction(SET_PRIMARY_ACCOUNT),
  cacheNextRoute: createAction(CACHE_NEXT_ROUTE, nextPath => ({ nextPath })),
  failedRequest: createAction(FAILED_REQUEST),
};

// Reducer
export const defaultState = {
  stage: STAGES.selecting,
  selectedBank: null,
  accountId: null,
  bankLinkId: null,
  challengeType: null,
  isLinking: false,
  isSelecting: false,
  nextPath: '/',
  networkError: false,
};

export default handleActions(
  {
    /**
     * Handles any network error to reset loading state and allow
     * the user to try again instead of getting stuck
     */
    [FAILED_REQUEST]: state => ({
      ...state,
      isLinking: false,
      isSelecting: false,
      networkError: true,
    }),
    [CACHE_NEXT_ROUTE]: (state, { payload: { nextPath } }) => ({
      ...state,
      nextPath,
    }),
    [SELECT_LINK]: (state, { payload: { linkId } }) => ({
      ...state,
      bankLinkId: linkId,
    }),
    [SELECT_BANK]: (state, { payload: { bank } }) => ({
      ...state,
      selectedBank: bank,
      stage: STAGES.fillingIn,
    }),
    [CREATED_LOGIN]: (state, { payload: { linkId } }) => ({
      ...state,
      stage: STAGES.syncing,
      bankLinkId: linkId,
    }),
    [START_LINK]: (state, action) => ({
      ...state,
      networkError: false,
      isLinking: true,
    }),
    [FAILED_LINK]: (state, { payload: { errorStatus } }) => ({
      ...state,
      stage: shouldTryAgain(errorStatus)
        ? STAGES.fillingIn
        : STAGES.challenging,
      challengeType: errorStatus,
      isLinking: false,
    }),
    [FINISH_LINK]: (state, action) => ({
      ...state,
      stage: STAGES.primarySelection,
      isLinking: false,
    }),
    [SELECT_PRIMARY]: (state, { payload: { accountId } }) => ({
      ...state,
      accountId,
      networkError: false,
      isSelecting: true,
    }),
    [SET_PRIMARY_ACCOUNT]: (state, action) => ({
      ...state,
      stage: STAGES.complete,
      isSelecting: false,
    }),
    [RETRY_LINK]: (state, action) => ({
      ...state,
      stage: STAGES.syncing,
    }),
    [GOTO]: (state, { payload: { stage } }) => ({
      ...state,
      stage,
    }),
    [RESET]: () => defaultState,
  },
  defaultState,
);
