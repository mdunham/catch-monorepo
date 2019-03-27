import * as Sentry from '@sentry/browser';

const SENTRY_DSN_WEB =
  'https://ae972e4ff7c44782a153a495aed7ad88@sentry.io/1363083';

function initSentry() {
  Sentry.init({
    dsn: SENTRY_DSN_WEB,
  });
}

function logSentryError(exception, extra) {
  Sentry.withScope(scope => {
    if (extra && typeof extra === 'object') {
      Object.keys(extra).forEach(key => {
        scope.setExtra(key, extra[key]);
      });
      Sentry.captureException(exception);
    }
  });
}

function setSentryUser(user) {
  Sentry.withScope(scope => {
    scope.setUser(user);
  });
}

class SentryUser {}

export { Sentry, initSentry, logSentryError, setSentryUser, SentryUser };
