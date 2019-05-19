/**
 * Web abstraction for same import
 * as RN
 */
export const getLocale = _ =>
  new Promise((resolve, reject) => resolve(navigator.language));
