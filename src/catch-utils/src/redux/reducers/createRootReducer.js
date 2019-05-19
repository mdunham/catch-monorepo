import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import { routerReducer } from 'react-router-redux';
import formReducer from 'redux-form/lib/reducer';
import { AsyncStorage, Platform } from 'react-native';
import storage from 'redux-persist/lib/storage';

// Injected in the root
// @NOTE: leave this here until we are certain there are no side effects
// import { languageReducer, languageConstants } from '@covered/rio-util-language';
// import { authReducer, authConstants } from '@catch/login';
// import { toastReducer, toastConstants } from '@catch/errors';

// @NOTE We can make different configs if needed
const persistConfig = {
  key: 'covered',
  storage,
  // blacklist anything like: blacklist: ['authentication'],
};

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    // We can add any reducer based on platform here
    ...Platform.select({
      web: {
        router: routerReducer,
      },
    }),
    // We can also persist some of them in the cache
    // I like persisting forms in case page is refreshed before submit...
    // form: persistReducer(persistConfig, formReducer),
    form: formReducer,

    // @NOTE: leave this here until were are sure there no side effects
    // [languageConstants.NAME]: languageReducer,
    // [authConstants.NAME]: authReducer,
    // [toastConstants.NAME]: toastReducer,

    // Then we can inject more later
    ...injectedReducers,
  });
}
