import { createSelector } from 'reselect';
import { NAME } from './duck';

function createLocalSelector(namespace) {
  return function selector(key) {
    return state => state[namespace][key];
  };
}

// selectorCreator that creates convenience selectors that target this module.
// const selector = key => state => state[NAME][key]

const selector = createLocalSelector(NAME);

// ---------------
// Input Selectors
// ---------------
export const getIsAuthenticated = selector('isAuthenticated');
export const getIsAuthenticating = selector('isAuthenticating');
export const getCredentials = selector('credentials');
export const getLastSignInEmail = selector('lastSignInEmail');
export const getLastSignInGivenName = selector('lastSignInGivenName');
export const getPWRequestEmail = selector('pwRequestEmail');
export const getUserSuccess = selector('userSuccess');
export const getAuthError = selector('error');
export const getIsResendingCode = selector('isResendingCode');
export const getResentCode = selector('resentCode');
export const getSignupCode = selector('signupCode');
export const getSignupStep = selector('signupStep');
export const getUserContext = selector('userContext');
export const getIsProcessing = selector('isProcessing');
export const getNavId = selector('componentId');

// -----------------
// Complex Selectors
// -----------------
export const getLastEmail = createSelector(
  [getLastSignInEmail, getCredentials],
  (email, creds) => {
    return email.length > 0 ? email : creds.email || '';
  },
);
