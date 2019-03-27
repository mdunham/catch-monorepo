import Env from '../env';
import Log from '../logger';
import {
  AuthenticationDetails,
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const userPool = new CognitoUserPool({
  UserPoolId: Env.authCreds.userPoolId,
  ClientId: Env.authCreds.userPoolWebClientId,
});

/**
 * This library's lack of elegance is such that
 * we are forced to get the user's session in order to load
 * session tokens from the cache or else the currentUser() is not
 * actually authenticated.
 */
export function currentProviderUser() {
  return new Promise((resolve, reject) => {
    function getUser() {
      const cognitoUser = userPool.getCurrentUser();
      if (!cognitoUser) {
        reject('No current user');
      }
      return cognitoUser;
    }
    if (Env.isNative) {
      userPool.storage.sync((err, res) => {
        if (err) {
          reject(err);
        }
        if (res === 'SUCCESS') {
          const user = getUser();
          if (user) {
            user.getSession((err, session) => {
              if (err) {
                reject(err);
              }
              resolve(user);
            });
          }
        }
      });
    } else {
      const user = getUser();
      user.getSession((err, session) => {
        if (err) {
          reject(err);
        }
        resolve(user);
      });
    }
  });
}

export function signIn({ email, password }) {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: result => {
        resolve(cognitoUser);
      },
      onFailure: reject,
    });
  });
}

/**
 * This method is used for S3 identification
 */
export function getJWTToken() {
  return currentProviderUser().then(cognitoUser => {
    return new Promise((resolve, reject) => {
      if (!cognitoUser) {
        reject('No current user');
      }
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        }
        const jwt = session.getIdToken().getJwtToken();
        resolve(jwt);
      });
    });
  });
}

export function signUp({ email, password, ...attrs }) {
  const attributes = Object.keys(attrs).map(
    attr => new CognitoUserAttribute({ Name: attr, Value: attrs[attr] }),
  );
  Log.debug(attributes);
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributes, null, (err, result) => {
      if (err) {
        reject(err);
      }
      const cognitoUser = result.user;
      Log.debug(cognitoUser);
      resolve(cognitoUser);
    });
  });
}

export function confirmSignUp({ email, code }) {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export function signOut() {
  return currentProviderUser().then(user => user.signOut());
}

export function forgotPassword(email) {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}

export function confirmForgotPassword({ email, code, newPassword }) {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });
}

export function resendAuthCode(email) {
  const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
}

export function getCredentials() {
  return currentProviderUser().then(cognitoUser => {
    return new Promise((resolve, reject) => {
      cognitoUser.getSession((err, session) => {
        if (err) {
          reject(err);
        }
        resolve({
          idToken: session.getIdToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken(),
        });
      });
    });
  });
}

export function getUserAttributes(user) {
  return new Promise((resolve, reject) => {
    user.getUserAttributes((err, result) => {
      if (err) {
        reject(err);
      }
      Log.debug('attributes cb');
      if (result) {
        const toConvertToInt = ['annualIncome', 'spouseIncome'];
        const parsedResult = result.reduce((acc, attr) => {
          let name = attr.getName();
          if (/custom:/.test(name)) {
            name = name.split(':')[1];
          }
          if (toConvertToInt.includes(name)) {
            acc[name] = parseInt(attr.getValue(), 10);
          } else {
            acc[name] = attr.getValue();
          }
          return acc;
        }, {});
        resolve(parsedResult);
      }
    });
    /**
     * @BUG: we silently catch errors here as the cognito lib
     * seem to be calling this callback with an error randomly
     * even though the operation succeeded. We need to investigate
     * why exactly or whether this might cause any issue.
     */
  }).catch(err => {});
}

export function changePassword({ oldPassword, newPassword }) {
  return currentProviderUser().then(user => {
    return new Promise((resolve, reject) => {
      user.changePassword(oldPassword, newPassword, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });
  });
}

export function changeEmail({ email }) {
  return currentProviderUser().then(user => {
    return new Promise((resolve, reject) => {
      const attributes = [
        new CognitoUserAttribute({ Name: 'email', Value: email }),
      ];
      user.updateAttributes(attributes, (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      });
    });
  });
}

export function confirmEmail({ code }) {
  return currentProviderUser().then(user => {
    return new Promise((resolve, reject) => {
      user.verifyAttribute('email', code, {
        onSuccess: resolve,
        onFailure: reject,
      });
    });
  });
}
