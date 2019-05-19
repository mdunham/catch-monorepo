import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { actions, selectors as sel } from '../store';
import ChangePasswordForm from '../forms/ChangePasswordForm';
import { SettingsGroup } from '../components';

export class ChangePassword extends React.PureComponent {
  static propTypes = {
    changePassword: PropTypes.func.isRequired,
    isPasswordChanging: PropTypes.bool.isRequired,
  };

  handlePassword = values => {
    this.props.changePassword(values);
  };

  render() {
    const { passwordTitle, isPasswordChanging } = this.props;

    return (
      <SettingsGroup title={passwordTitle}>
        <ChangePasswordForm
          isChanging={isPasswordChanging}
          onSubmit={this.handlePassword}
        />
      </SettingsGroup>
    );
  }
}

export default connect(
  createStructuredSelector({
    isPasswordChanging: sel.getIsPasswordChanging,
  }),
  actions,
)(ChangePassword);
