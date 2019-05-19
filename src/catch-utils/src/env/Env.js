const isNodeEnv = str => process.env.NODE_ENV === str;
const isCoveredEnv = str => process.env.REACT_APP_COVERED_ENV === str;
const isNative = _ => navigator && navigator.product === 'ReactNative';
const isDesktop = _ => process.env.REACT_APP_PLATFORM === 'desktop';
const isSafari = _ => /Apple/.test(navigator.vendor);

const environments = {
  // Prod/Stage/Dev are the primary environments we have our applications
  // deployed in.
  isProd: isNodeEnv('production') && isCoveredEnv('prod'),
  isStage: isNodeEnv('production') && isCoveredEnv('stage'),
  isDev: isNodeEnv('production') && isCoveredEnv('dev'),

  // isLocal is used for when the dev server hot reloading is happening
  isLocal: isNodeEnv('development'),

  // isProdLike is used for whenever we're building code in a
  // minified/production like way.
  isProdLike: isNodeEnv('production'),
  // isDevLike is used for whenever we're in an environment used for developers
  // to sandbox/experiment.
  isDevLike: isNodeEnv('development') || isCoveredEnv('dev'),

  // isTest is used when the test suite is running
  isTest: isNodeEnv('test'),

  // isNative is used when code is rendering in the React Native context
  isNative: isNative(),

  // Should be fairly reliable...
  isSafari: isSafari(),

  // ask Andrew
  isDesktop: isDesktop(),
};

const authCreds = {
  identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
  userPoolId: process.env.REACT_APP_USER_POOL_ID,
  region: process.env.REACT_APP_AWS_REGION,
  userPoolWebClientId: process.env.REACT_APP_WEB_CLIENT_ID,
};

const analytics = {
  segmentKey: process.env.REACT_APP_SEGMENT_KEY,
};

const graphql = {
  uri: process.env.REACT_APP_GRAPHQL_URL,
};

const intercom = {
  appId: process.env.INTERCOM_ID,
};

const serverEvents = {
  uri: process.env.SERVER_EVENTS_PATH,
};

const uploads = {
  bucket: process.env.REACT_APP_UPLOAD_BUCKET,
};

const envNames = {
  dev: 'Dev',
  stage: 'Stage',
  prod: 'Beta',
};

export default {
  ...environments,
  serverEvents,
  graphql,
  authCreds,
  intercom,
  uploads,
  analytics,
  envName: envNames[process.env.REACT_APP_COVERED_ENV],
  isSentryEnabled: environments.isProd,
};
