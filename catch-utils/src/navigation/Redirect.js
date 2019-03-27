import React from 'react';

import { goTo, navigationPropTypes } from './index';

class Redirect extends React.PureComponent {
  static propTypes = navigationPropTypes;

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  componentDidMount() {
    if (this.props.to) {
      this.goTo(this.props.to, this.props.state);
    }
  }
  componentWillUnmount() {
    if (this.props.cb) {
      this.props.cb();
    }
  }
  render() {
    return null;
  }
}

export default Redirect;
