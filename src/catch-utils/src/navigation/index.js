import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { createLogger } from '../logger';

const Log = createLogger('navigation');

/**
 * Returns whatever route state there is
 * TODO: make is safer...
 */
export function getRouteState() {
  if (Platform.OS === 'web') {
    return this.props.history.location.state;
  }
  // Native navigation the state is now passed in props
  return this.props; // this.props.navigation.state.params;
}

/**
 * This makes sure at least one of the navigation props is
 * passed to the component.
 */
export const navigationPropTypes = {
  push: (props, propName, componentName) => {
    if (!props[propName] && !props.componentId) {
      return new Error(
        `You must at least pass push or a componentId to ${componentName} in order to navigate`,
      );
    }
  },
  componentId: (props, propName, componentName) => {
    if (!props[propName] && !props.push) {
      return new Error(
        `You must at least pass push or a componentId to ${componentName} in order to navigate`,
      );
    }
  },
};

export { default as goTo } from './goTo';
export { navigationOptions } from './navigationOptions';
export { default as getParentRoute } from './getParentRoute';
export { bottomTabs, paycheckTabs, login } from './navProperties';
export { default as Redirect } from './Redirect';
export { default as goBack } from './goBack';
export { default as mergeOptions } from './mergeOptions';
