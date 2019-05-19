import { actionTypes } from 'redux-form';

const state = {};
const formMiddleware = () => next => action => {
  switch (action.type) {
    case actionTypes.DESTROY:
      state[action.meta.form] = (state[action.meta.form] || 0) - 1;
      if (state[action.meta.form] <= 0) {
        return next(action);
      } else {
        // Drop the action
        return false;
      }
    case actionTypes.INITIALIZE:
      state[action.meta.form] = (state[action.meta.form] || 0) + 1;
      return next(action);
    default:
      return next(action);
  }
};

export default formMiddleware;

// @NOTE: solution found here:
// https://github.com/erikras/redux-form/issues/3435#issuecomment-359371803
