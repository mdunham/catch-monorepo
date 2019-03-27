import { push } from 'react-router-redux';
import { createLogger } from '../logger';

const Log = createLogger('navigation');

/**
 * Bind this to any react component to enable cross Platform navigation
 * Pass an array to navigate deep inside a sibling navigator in native
 * @param { path: String || Array, state: Object }
 */
function goTo(path, state, type = 'PUSH') {
  const isString = typeof path === 'string';
  Log.debug(path);
  const route = isString ? path : ''.concat(...path);
  // Prevents the necessity of connecting push if the component
  // is already connect to redux
  if (this.props.dispatch) {
    this.props.dispatch(push(route, state));
    return;
  }
  return this.props.push(route, state);
}

export default goTo;
