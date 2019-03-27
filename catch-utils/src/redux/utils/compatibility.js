/**
 * This ensures we remove the store in case of an app updated
 */

import { AsyncStorage, Platform } from 'react-native';

// We can manage that differently later
const compatibleStoreVersion = '0.01';

const LS_GROUP = 'CoveredStoreCompatibility',
  LS_VERSIONING = `${LS_GROUP}:version`;

const storage = Platform.select({
  web: window.localStorage,
  default: AsyncStorage,
});

export async function ensureCompatibility() {
  try {
    const stored = await storage.getItem(LS_VERSIONING);
    if (stored && stored === JSON.stringify(compatibleStoreVersion)) {
      return false; // no need to update
    }
  } catch (error) {}
  return await resetCompatibility();
}

async function resetCompatibility() {
  try {
    const keys = await storage.getAllKeys();
    // force clear everything except for versioning (all reduxPersist:x and Parse:x keys)
    const targets = (keys || []).filter(k => k !== LS_VERSIONING);
    if (targets.length) {
      await storage.multiRemove(targets);
    }
    // after storage reset, update the compatibility to the current storage version
    return await updateCompatibility();
  } catch (error) {}
  return false;
}

async function updateCompatibility() {
  try {
    await storage.setItem(
      LS_VERSIONING,
      JSON.stringify(compatibleStoreVersion),
    );
    return true;
  } catch (error) {}
  return false;
}
