import { Platform, AsyncStorage } from 'react-native';
import { createLogger } from '../logger';

const Log = createLogger('cache');

function getStorage(storageType) {
  Log.debug(storageType);
  if (global[storageType] != null) {
    return global[storageType];
  }

  let data = {};

  return {
    setItem: (id, val) => (data[id] = String(val)),
    getItem: id => (data.hasOwnProperty(id) ? data[id] : undefined),
    removeItem: id => delete data[id],
    clear: () => (data = {}),
  };
}

// Support for web and native cache storage
const localStorage = Platform.select({
  web: getStorage('localStorage'),
  default: AsyncStorage,
});

const sessionStorage = getStorage('sessionStorage');

export { localStorage, sessionStorage };
