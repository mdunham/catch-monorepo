import { AsyncStorage, Platform } from 'react-native';
import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { formMiddleware } from '../middlewares';
import { ensureCompatibility } from '../utils';
import { createRootReducer } from '../reducers';
import logger from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();

let store = {};

function configureStore(history) {
  // Order matters:
  // 1. sagaMiddleware
  // 2. routerMiddleware (if history is not provided we're native)
  // 3. etc
  const middlewares = Platform.select({
    web: [sagaMiddleware, routerMiddleware(history), formMiddleware],
    default: [
      sagaMiddleware,
      formMiddleware,
      // Good way to peep in the store but very verbose
      //logger,
    ],
  });

  const createAppStore = applyMiddleware(...middlewares)(createStore);
  const reducers = createRootReducer();

  // This makes sure we don't have some old data in there
  // const didReset = await ensureCompatibility();
  store = createAppStore(reducers);
  store.runSaga = sagaMiddleware.run;
  store.injectedReducers = {};
  store.injectedSagas = {};

  return store;
}

export { store };

export default configureStore;
