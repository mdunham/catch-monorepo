import { createAction, handleActions } from 'redux-actions';

export const NAME = 'guide';
export const PROGRESS_DISPLAYED = `catch/${NAME}/PROGRESS_DISPLAYED`;
export const PROGRESS_HIDDEN = `catch/${NAME}/PROGRESS_HIDDEN`;
export const INFO_MODAL_DISPLAYED = `catch/${NAME}/INFO_MODAL_DISPLAYED`;
export const INFO_MODAL_HIDDEN = `catch/${NAME}/INFO_MODAL_HIDDEN`;
export const LOAD_PLAN_UPDATES = `catch/${NAME}/LOAD_PLAN_UPDATES`;
export const NEXT_PLAN_UPDATE = `catch/${NAME}/NEXT_PLAN_UPDATE`;
export const RESET_PLAN_UPDATES = `catch/${NAME}/RESET_PLAN_UPDATES`;

export const constants = {
  NAME,
  PROGRESS_DISPLAYED,
  PROGRESS_HIDDEN,
  INFO_MODAL_DISPLAYED,
  INFO_MODAL_HIDDEN,
  LOAD_PLAN_UPDATES,
  NEXT_PLAN_UPDATE,
  RESET_PLAN_UPDATES,
};

export const actions = {
  showGuideProgress: createAction(PROGRESS_DISPLAYED),
  hideGuideProgress: createAction(PROGRESS_HIDDEN),
  showGuideInfoModal: createAction(INFO_MODAL_DISPLAYED),
  hideGuideInfoModal: createAction(INFO_MODAL_HIDDEN),
  loadPlanUpdates: createAction(LOAD_PLAN_UPDATES),
  nextPlanUpdate: createAction(NEXT_PLAN_UPDATE),
  resetPlanUpdates: createAction(RESET_PLAN_UPDATES),
};

export const defaultState = {
  progressMenu: null,
  infoModal: null,
  updateIndex: 0,
  updates: [],
};

export default handleActions(
  {
    [PROGRESS_DISPLAYED]: (state, { payload }) => ({
      ...state,
      progressMenu: payload,
    }),
    [PROGRESS_HIDDEN]: state => ({
      ...state,
      progressMenu: null,
    }),
    [INFO_MODAL_DISPLAYED]: (state, { payload }) => ({
      ...state,
      infoModal: payload,
    }),
    [INFO_MODAL_HIDDEN]: state => ({
      ...state,
      infoModal: null,
    }),
    [LOAD_PLAN_UPDATES]: (state, { payload }) => ({
      ...state,
      updates: payload,
    }),
    [NEXT_PLAN_UPDATE]: state => ({
      ...state,
      updateIndex: state.updateIndex + 1,
    }),
    [RESET_PLAN_UPDATES]: state => ({
      ...state,
      updates: [],
      updateIndex: 0,
    }),
  },
  defaultState,
);
