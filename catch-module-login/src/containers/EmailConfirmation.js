import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions } from '../store/duck';
import * as sel from '../store/selectors';
import { createStructuredSelector } from 'reselect';
import { ConfirmationCodeForm } from '../forms';

export class EmailConfirmation extends Component {
  static propTypes = {
    confirmCode: PropTypes.func.isRequired,
    isAuthenticating: PropTypes.bool.isRequired,
  };

  handleSubmit = ({ code }) => {
    this.props.confirmCode(code);
  };

  render() {
    return (
      <ConfirmationCodeForm
        submitError={this.props.codeError}
        isAuthenticating={this.props.isAuthenticating}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const withConnect = connect(
  createStructuredSelector({
    isAuthenticating: sel.getIsAuthenticating,
    codeError: sel.getAuthError,
  }),
  { confirmCode: actions.confirmCode },
);

export default withConnect(EmailConfirmation);
