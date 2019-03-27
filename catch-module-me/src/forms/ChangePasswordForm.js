import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { Button, Box, ReduxInput } from '@catch/rio-ui-kit';
import {
  createValidator,
  changePasswordValidation,
  PasswordValidation,
} from '@catch/utils';
import { PasswordField } from '@catch/common';

export class ChangePasswordForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isChanging: PropTypes.bool.isRequired,
  };

  render() {
    const { handleSubmit, isChanging, invalid } = this.props;
    return (
      <Box pr={2}>
        <Field
          id="oldPassword"
          name="oldPassword"
          component={ReduxInput}
          placeholder=""
          type="password"
          label="Old Password"
          onSubmit={handleSubmit}
        />
        <PasswordField form={formName} rel="change" />

        <Box row justify="flex-end" w={1} mt={1}>
          <Button
            loading={isChanging}
            onClick={handleSubmit}
            disabled={invalid}
          >
            Save
          </Button>
        </Box>
      </Box>
    );
  }
}

const formName = 'ChangePasswordForm';

export default reduxForm({
  form: formName,
  validate: createValidator(changePasswordValidation),
})(ChangePasswordForm);
