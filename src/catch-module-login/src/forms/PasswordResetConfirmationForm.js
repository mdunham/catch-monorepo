import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import { Box, ReduxInput, Checkbox, Button } from '@catch/rio-ui-kit';
import {
  createValidator,
  passwordResetConfirmation,
  PasswordValidation,
} from '@catch/utils';
import { PasswordField } from '@catch/common';

const PREFIX = 'catch.module.login.PasswordResetConfirmationForm';
export const COPY = {
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  CodeMismatchException: (
    <FormattedMessage id={`${PREFIX}.CodeMismatchException`} />
  ),
  defaultError: <FormattedMessage id="catch.defaultError" />,
};

export class PasswordResetConfirmationForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  state = {
    showPw: false,
  };

  togglePw = ({ target }) => {
    this.setState({
      showPw: target.checked,
    });
  };

  render() {
    const {
      handleSubmit,
      intl: { formatMessage },
      invalid,
      authError,
      viewport,
    } = this.props;
    const { showPw } = this.state;

    return (
      <Box>
        <Field
          name="code"
          component={ReduxInput}
          label={formatMessage({ id: `${PREFIX}.codeInput.label` })}
          onSubmit={handleSubmit}
          props={{
            submitError: !!authError
              ? COPY[authError] || COPY['defaultError']
              : undefined,
          }}
          confirmable={false}
          keyboardType="number-pad"
        />

        <PasswordField form={formName} rel="change" onSubmit={handleSubmit} />
        {/*@NOTE: this  Button is in the view itself in mobile viewport */}
        {viewport !== 'PhoneOnly' && (
          <Box row justify="flex-end" mt={3}>
            <Button
              onClick={handleSubmit}
              disabled={invalid}
              style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
            >
              {COPY['submitButton']}
            </Button>
          </Box>
        )}
      </Box>
    );
  }
}

const formName = 'PasswordResetConfirmationForm';

const withReduxForm = reduxForm({
  form: formName,
  validate: createValidator(passwordResetConfirmation),
});

const enhance = compose(
  withReduxForm,
  injectIntl,
);

export default enhance(PasswordResetConfirmationForm);
