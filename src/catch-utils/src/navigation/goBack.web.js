import { go } from 'react-router-redux';

// Movex backward one location in the browser history
// Bind to a class component in order to access `this`
function goBack() {
  this.props.dispatch(go(-1));
}

export default goBack;
