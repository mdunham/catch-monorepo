import { createAction, handleActions } from 'redux-actions';

// Constants
export const STEPS = {
  estimation: 'estimation',
  riskLevel: 'risk-level',
  portfolioSelection: 'portfolio-selection',
  accountType: 'account-type',
  legal: 'legal',
  beneficiary: 'beneficiary',
  confirm: 'confirm',
};

export const NAME = 'createRetirementGoal';
export const SAVED_GOAL = `@@retirementModule/${NAME}/SAVED_GOAL`;
export const FAILED_SAVE_GOAL = `@@retirementModule/${NAME}/FAILED_SAVE_GOAL`;
export const CREATED_ACCOUNT = `@@retirementModule/${NAME}/CREATED_ACCOUNT`;
export const FAILED_CREATE_ACCOUNT = `@@retirementModule/${
  NAME
}/FAILED_CREATE_ACCOUNT`;

export const constants = {
  NAME,
  SAVED_GOAL,
  FAILED_SAVE_GOAL,
  CREATED_ACCOUNT,
  FAILED_CREATE_ACCOUNT,
};

// Action Creators
export const actions = {
  savedGoal: createAction(SAVED_GOAL, data => ({ data })),
  failedGoal: createAction(FAILED_SAVE_GOAL, errMsg => ({ errMsg })),
  createdAccount: createAction(CREATED_ACCOUNT, data => ({ data })),
  failedCreateAccount: createAction(FAILED_CREATE_ACCOUNT, errMsg => ({
    errMsg,
  })),
};

export const defaultState = {
  goal: null,
};

export default handleActions(
  {
    [SAVED_GOAL]: (state, { payload: { data } }) => ({
      ...state,
      goal: data,
    }),
  },
  defaultState,
);
