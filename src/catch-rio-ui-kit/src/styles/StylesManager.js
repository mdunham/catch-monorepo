import { StyleSheet, Platform } from 'react-native';

import styles from './styles';

class StylesManager {
  _viewport;
  constructor(OS) {
    this.os = OS;
    this.StyleSheet = StyleSheet.create(styles);
  }
  /**
   * @param {string|Array} key
   * @param {string} viewport
   * @return Array|number
   * Here we can perform any aliasing operations
   * we want for backward compatibility etc
   */
  get(key, viewport) {
    // We cache the viewport
    // if (viewport) {
    //   this._viewport = viewport
    // }
    if (Array.isArray(key)) {
      return key.map(k => {
        // Allows to pass a style object if needed
        if (typeof k !== 'string') {
          return k;
        }
        return this.get(k, viewport);
      });
    }
    const ss = this.StyleSheet;
    if (viewport) {
      if (ss[`${key}/${viewport}`]) {
        return ss[`${key}/${viewport}`];
      }
      if (viewport === 'PhoneOnly' && ss[`${key}/Mobile`]) {
        return ss[`${key}/Mobile`];
      }
      if (viewport === 'TabletPortraitUp' && !ss[`${key}/${viewport}`]) {
        return (
          ss[`${key}/TabletLandscapeUp`] || ss[`${key}/Desktop`] || ss[key]
        );
      }
      if (viewport === 'TabletLandscapeUp' && ss[`${key}/Desktop`]) {
        return ss[`${key}/Desktop`];
      }
    }
    return ss[key];
  }
}

export default new StylesManager(Platform.OS);
