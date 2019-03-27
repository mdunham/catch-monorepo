import { createAction, handleActions } from 'redux-actions';

// Constants
export const NAME = 'changePassword';
export const PASSWORD_REQUEST = `covered/${NAME}/PASSWORD_REQUEST`;
export const PASSWORD_SUCCESS = `covered/${NAME}/PASSWORD_SUCCESS`;
export const PASSWORD_FAILURE = `covered/${NAME}/PASSWORD_FAILURE`;
export const EMAIL_REQUEST = `catch/${NAME}/EMAIL_REQUEST`;
export const EMAIL_SUCCESS = `catch/${NAME}/EMAIL_SUCCESS`;
export const EMAIL_FAILURE = `catch/${NAME}/EMAIL_FAILURE`;
export const CODE_REQUEST = `catch/${NAME}/CODE_REQUEST`;
export const CODE_SUCCESS = `catch/${NAME}/CODE_SUCCESS`;
export const CODE_FAILURE = `catch/${NAME}/CODE_FAILURE`;
export const TOGGLE_MODAL = `catch/${NAME}/TOGGLE_MODAL`;

export const constants = {
  NAME,
  PASSWORD_REQUEST,
  PASSWORD_SUCCESS,
  PASSWORD_FAILURE,
  EMAIL_REQUEST,
  EMAIL_SUCCESS,
  EMAIL_FAILURE,
  CODE_REQUEST,
  CODE_SUCCESS,
  CODE_FAILURE,
  TOGGLE_MODAL,
};

// Action Creators
export const actions = {
  changePassword: createAction(PASSWORD_REQUEST),
  changedPassword: createAction(PASSWORD_SUCCESS),
  failedPassword: createAction(PASSWORD_FAILURE),
  changeEmail: createAction(EMAIL_REQUEST),
  changedEmail: createAction(EMAIL_SUCCESS),
  failedEmail: createAction(EMAIL_FAILURE),
  confirmEmail: createAction(CODE_REQUEST),
  confirmedEmail: createAction(CODE_SUCCESS),
  failedEmailConfirmation: createAction(CODE_FAILURE),
  toggleModal: createAction(TOGGLE_MODAL),
};

// Reducer
export const defaultState = {
  isPasswordChanging: false,
  isEmailChanging: false,
  isRequestingCode: false,
  isCodeSubmitting: false,
  emailModalVisible: false,
  newEmailAddress: null,
};

export default handleActions(
  {
    [PASSWORD_REQUEST]: (state, action) => ({
      ...state,
      isPasswordChanging: true,
    }),
    [PASSWORD_SUCCESS]: (state, action) => ({
      ...state,
      isPasswordChanging: false,
    }),
    [PASSWORD_FAILURE]: (state, action) => ({
      ...state,
      isPasswordChanging: false,
    }),
    [EMAIL_REQUEST]: (state, action) => ({
      ...state,
      newEmailAddress: action.payload.email,
      isEmailChanging: true,
    }),
    [EMAIL_SUCCESS]: (state, action) => ({
      ...state,
      isEmailChanging: false,
      isRequestingCode: true,
    }),
    [EMAIL_FAILURE]: (state, action) => ({
      ...state,
      isEmailChanging: false,
    }),
    [CODE_REQUEST]: (state, action) => ({
      ...state,
      isCodeSubmitting: true,
    }),
    [CODE_SUCCESS]: (state, action) => ({
      ...state,
      newEmailAddress: null,
      isCodeSubmitting: false,
      isRequestingCode: false,
    }),
    [CODE_FAILURE]: (state, action) => ({
      ...state,
      isCodeSubmitting: false,
    }),
    [TOGGLE_MODAL]: state => ({
      ...state,
      emailModalVisible: !state.emailModalVisible,
    }),
  },
  defaultState,
);
