
import React from 'react';
import { AppRegistry } from 'react-native';
import access from 'safe-access';
import { push } from 'react-router-redux';

// Setup
import AppProvider from './web/modules/AppProvider';
import { client } from '@catch/apollo';
import {
  translationMessages,
  languageReducer,
  languageConstants,
  configureStore,
  injectReducerFactory,
  init as initLogger,
  Log,
  Env,
  Auth,
  initAnalytics,
} from '@catch/utils';
import browserHistory from 'web/config/history';

// Import reducers from each modules here
import * as Api from '@catch/login/src/store/endpoints';
import { authActions, authReducer, authConstants } from '@catch/login';
import { toastReducer, toastConstants } from '@catch/errors';
import { guideReducer, guideConstants } from '@catch/guide';

// StyleGuide should not be imported with the rest of the build
const isStyleguide = process.env.REACT_APP_STYLEGUIDE;

const MOUNT_NODE = document.getElementById('app');

// Logger will log messages in dev and prod or send
// them to Sentry in production
initLogger();
Log.info(Env, 'env');

async function setup() {
  class Root extends React.Component {
    constructor() {
      super();
      this.state = {
        credentialsHydrated: false,
        storeCreated: false,
        intlLoaded: !!window.Intl,
        error: null,
      };
    }

    async componentDidMount() {
      const store = configureStore(browserHistory);
      // We inject our auth reducer here to avoid import spaghetti
      const injectReducer = injectReducerFactory(store, true);
      injectReducer(authConstants.NAME, authReducer);
      injectReducer(toastConstants.NAME, toastReducer);
      injectReducer(languageConstants.NAME, languageReducer);
      injectReducer(guideConstants.NAME, guideReducer);

      this.setState({
        store,
        storeCreated: true,
      });

      const credentials = await Auth.getCredentials().catch(error => {
        Log.debug(error);
      });

      if (typeof credentials !== 'undefined') {
        try {
          const user = await Api.checkUserExists();
          if (!user.error && access(user, 'data.viewer.user.filingStatus')) {
            store.dispatch(
              authActions.authenticate({
                credentials,
                givenName: access(user, 'data.viewer.user.givenName'),
              }),
            );
          }
        } catch (e) {
          Log.debug(e);
        }
      }

      this.setState({
        credentialsHydrated: true,
      });

      if (!window.Intl) {
        // Intl polyfill
        await Promise(resolve => {
          resolve(import(/* webpackChunkName: "intl-polyfill" */ 'intl'));
        });
        // import all polyfilled data. Using .all() for when we add future locales
        await Promise.all([
          import(/* webpackChunkName: "en-translations" */ 'intl/locale-data/jsonp/en.js'),
        ]);
        this.setState({
          intlLoaded: true,
        });
      }
    }

    render() {
      const {
        store,
        storeCreated,
        intlLoaded,
        credentialsHydrated,
      } = this.state;
      if (!intlLoaded || !credentialsHydrated || !storeCreated) {
        return null; // We could have a cool loading screen here
      }
      return (
        <AppProvider
          store={store}
          client={client}
          messages={translationMessages}
          history={browserHistory}
        />
      );
    }
  }
  if (Env.isProdLike) {
    initAnalytics(Env.analytics.segmentKey, Env.isDevLike);
  }
  let StyleGuide;
  if (isStyleguide) {
    StyleGuide = await import('./catch-styleguide/src/App.ios');
  }
  AppRegistry.registerComponent(
    'Root',
    () => (isStyleguide ? StyleGuide.default : Root),
  );
  AppRegistry.runApplication('Root', {
    initialProps: {},
    rootTag: MOUNT_NODE,
  });
}

setup();
