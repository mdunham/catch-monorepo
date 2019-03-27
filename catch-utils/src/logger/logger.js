import debug from 'debug';
import { Platform } from 'react-native';
import { initSentry, logSentryError } from './Sentry';
import Env from '../env';

const BASE = 'catch';
const COLORS = {
  debug: '#1FBD81',
  info: '#4983FF',
  warn: '#FF7878',
  error: '#FF3D3D',
};

class Log {
  constructor(source) {
    this.source = source;
  }

  info(msg, source) {
    this.write(msg, 'info', source);
  }

  debug(msg, source) {
    this.write(msg, 'debug', source);
  }

  warn(msg, source) {
    this.write(msg, 'warn', source);
  }

  /**
   * @NOTE: we keep Sentry in error method
   * to avoid logging too much for now, we can increase breadcrumbs as we go
   */
  error(msg, source) {
    this.write(msg, 'error', source);
    if (Env.isSentryEnabled) {
      logSentryError(msg, { source });
    }
  }

  write(msg, level, source = '') {
    const namespace = `${BASE}:${level}:${this.source || source}`;
    const logger = debug(namespace);
    logger.color = COLORS[level];

    /* debugger doesn't work in native so we can still use Logger */
    if (Platform.OS === 'web') {
      // pretty print objects
      if (typeof msg === 'object') {
        logger('%o', msg);
      } else {
        logger(msg);
      }
    } else {
      console.log(namespace, msg);
    }
  }
}

const LOGGER = new Log();

// init can be used to set up the logger when an app mounts.  By default all
// messages will get logged.  You can use the shorthand of
// "covered:info,covered:warn" to show just warning/info etc.
export function init() {
  if (!Env.isSentryEnabled) {
    localStorage.setItem('debug', 'catch:*');
  } else {
    initSentry();
  }
}

// createLogger let's us continue using the singleton Logger but pin a source
// for a series of log statements.
export function createLogger(source) {
  return {
    debug: msg => LOGGER.debug(msg, source),
    info: msg => LOGGER.info(msg, source),
    warn: msg => LOGGER.warn(msg, source),
    error: msg => LOGGER.error(msg, source),
  };
}

export default LOGGER;
