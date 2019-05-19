import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import { createValidator, passwordReset } from '@catch/utils';
import { Button, Box, ReduxInput } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.login.PasswordResetForm';
export const COPY = {
  submitButton: <FormattedMessage id={`${PREFIX}.submitError`} />,
  LimitExceededException: (
    <FormattedMessage id={`${PREFIX}.LimitExceededException`} />
  ),
  defaultError: <FormattedMessage id="catch.defaultError" />,
};

export class PasswordResetForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
  };
  render() {
    const {
      invalid,
      handleSubmit,
      intl: { formatMessage },
      viewport,
      authError,
    } = this.props;

    return (
      <Box>
        <Field
          name="email"
          component={ReduxInput}
          label={formatMessage({ id: `${PREFIX}.emailInput.placeholder` })}
          onSubmit={handleSubmit}
          props={{
            submitError: !!authError
              ? COPY[authError] || COPY['defaultError']
              : undefined,
          }}
          autoCorrect={false}
          keyboardType="email-address"
        />
        {viewport !== 'PhoneOnly' && (
          <Box row justify="flex-end">
            <Button
              disabled={invalid}
              onClick={handleSubmit}
              style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
            >
              <FormattedMessage id={`${PREFIX}.submitButton`} />
            </Button>
          </Box>
        )}
      </Box>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'PasswordResetForm',
  validate: createValidator(passwordReset),
});

const enhance = compose(
  withReduxForm,
  injectIntl,
);

export default enhance(PasswordResetForm);
