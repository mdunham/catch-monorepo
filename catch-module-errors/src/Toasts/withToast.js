import { connect } from 'react-redux';
import { actions } from './duck';

const withToast = connect(undefined, actions);
export default withToast;
