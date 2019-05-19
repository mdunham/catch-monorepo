import { createAction, handleActions } from 'redux-actions';

// Constants
export const NAME = 'toasts';
export const TOAST_REQUESTED = `covered/${NAME}/TOAST_REQUESTED`;
export const TOAST_DISPLAYED = `covered/${NAME}/TOAST_DISPLAYED`;
export const TOAST_HIDDEN = `covered/${NAME}/TOAST_HIDDEN`;
export const TOAST_CLEARED = `covered/${NAME}/TOAST_CLEARED`;

// TODO - add readme documentation for the toast system
// TODO - add popErrorToast and popInfoToast, etc. helpers
// TODO - extract toast system into a separate module/package?
export const TOAST_TYPES = {
  primary: 'primary',
  info: 'info',
  error: 'error',
  success: 'success',
};

const TOAST_DEFAULT_OPTS = {
  type: TOAST_TYPES.primary,
  autoCloseIn: 6000,
  hideProgressBar: false,
  pauseOnHover: true,
};

let uniqueId = 1;

function getNextId() {
  return `toast-${uniqueId++}`;
}

export const constants = {
  NAME,
  TOAST_REQUESTED,
  TOAST_DISPLAYED,
  TOAST_HIDDEN,
  TOAST_TYPES,
  TOAST_CLEARED,
};

export const popToast = createAction(
  TOAST_REQUESTED,
  ({ msg, ...overrides }) => ({
    id: getNextId(),
    msg,
    ...TOAST_DEFAULT_OPTS,
    ...overrides,
  }),
);

export const popErrorToast = createAction(
  TOAST_REQUESTED,
  ({ msg, ...overrides }) => ({
    id: getNextId(),
    msg,
    ...TOAST_DEFAULT_OPTS,
    ...overrides,
    type: TOAST_TYPES.error,
  }),
);

// Action Creators
export const actions = {
  popToast,
  popErrorToast,
  hideToasts: createAction(TOAST_CLEARED),
  toastDisplayed: createAction(TOAST_DISPLAYED),
  toastHidden: createAction(TOAST_HIDDEN),
};

// Reducer
export const defaultState = [];

export default handleActions(
  {
    [TOAST_DISPLAYED]: (state, { payload }) => {
      return [...state, payload];
    },
    [TOAST_HIDDEN]: (state, { payload }) => {
      return state.filter(t => t.id !== payload.id);
    },
    [TOAST_CLEARED]: state => defaultState,
  },
  defaultState,
);
