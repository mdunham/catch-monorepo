import React from 'react';
import PropTypes from 'prop-types';

import { createLogger } from '@catch/utils';

import ErrorModal from './ErrorModal';

const Log = createLogger('error-boundary: ');

class ErrorBoundary extends React.PureComponent {
  static propTypes = {
    Component: PropTypes.func,
    render: PropTypes.func,
  };

  static defaultProps = {
    component: null,
  };
  state = {
    hasError: false,
    showModal: true,
    error: null,
    info: null,
  };
  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error,
      info,
    });
    Log.error(error);
    Log.info(info);
  }
  toggleMessage = () => {
    this.setState(({ showModal }) => ({
      showModal: !showModal,
    }));
  };
  render() {
    const { children, Component, render } = this.props;
    return this.state.hasError ? (
      <React.Fragment>
        {this._renderErrorComponent()}
        {this.state.showModal && <ErrorModal onClose={this.toggleMessage} />}
      </React.Fragment>
    ) : (
      this.props.children
    );
  }
  _renderErrorComponent = _ => {
    const { Component, render } = this.props;
    return typeof render === 'function' ? (
      render({ ...this.state })
    ) : (
      <Component onClose={this.toggleMessage} />
    );
  };
}

export default ErrorBoundary;
