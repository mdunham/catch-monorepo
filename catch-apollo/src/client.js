import { AsyncStorage, Platform } from 'react-native';
import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { CachePersistor } from 'apollo-cache-persist';
import { setContext } from 'apollo-link-context';
import { Auth, store, createLogger, Env } from '@catch/utils';
// Not very elegant
import { actions as authActions } from '@catch/login/src/store/duck';

const Log = createLogger('apollo-client');
// Handling sign in/out: https://github.com/apollographql/apollo-cache-persist/issues/34#issuecomment-371177206

// -------
// Links
// -------

const httpLink = new HttpLink({ uri: Env.graphql.uri });

let token, expTime;
const withToken = setContext(async () => {
  try {
    if (!token || expTime < Date.now() / 1000) {
      // If token is expired get fresh credentials
      const {
        idToken: {
          jwtToken,
          payload: { exp },
        },
      } = await Auth.getCredentials();
      token = jwtToken;
      expTime = exp;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  } catch (e) {
    return {};
  }
});

// Log users out whenever receiving a 401 unauthenticated
const logoutLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) => {
      // Ignore this error so Sentry does not pick it up
      if (
        !/^(?=.*?\bNotFound desc = User\b)(?=.*?\bdoes not exist\b).*$/.test(
          message,
        )
      ) {
        Log.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
      }
    });
  }
  if (networkError && networkError.statusCode === 401) {
    token = undefined;
    store.dispatch(authActions.signOut());
  }
});

// -------
// Cache
// -------

const cache = new InMemoryCache();
const persistor = new CachePersistor({
  cache,
  storage: Platform.select({
    default: AsyncStorage,
    web: window.localStorage,
  }),
});
persistor.restore();

const client = new ApolloClient({
  link: from([withToken, logoutLink, httpLink]),
  cache,
});

export async function signApolloOut() {
  token = undefined;
  await persistor.pause();
  Log.debug('paused persistor');
  await persistor.purge();
  Log.debug('purged');
  await client.resetStore();
  Log.debug('reset store');
}

export async function signApolloIn() {
  await client.resetStore();
  Log.debug('reset store');
  await persistor.resume();
}

export default client;
