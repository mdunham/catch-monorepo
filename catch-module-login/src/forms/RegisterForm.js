import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Box, Button } from '@catch/rio-ui-kit';
import { PasswordField, EmailField } from '@catch/common';
import { createValidator, registerForm } from '@catch/utils';
import { Header } from '../components';
const formName = 'RegisterForm';

const PREFIX = 'catch.module.login.ScreeningForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
};

export class RegisterForm extends React.Component {
  static propTypes = {
    invalid: PropTypes.bool,
    viewport: PropTypes.string.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  render() {
    const { handleSubmit, invalid, viewport } = this.props;
    return (
      <React.Fragment>
        <Header
          title={COPY['title']}
          subtitle={COPY['subtitle']}
          viewport={viewport}
        />
        <EmailField form={formName} />
        <PasswordField form={formName} onSubmit={handleSubmit} />
        <Box row justify="flex-end" mt={4}>
          <Button
            disabled={invalid}
            onClick={handleSubmit}
            style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
          >
            {COPY['submitButton']}
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

export default reduxForm({
  form: formName,
  validate: createValidator(registerForm),
})(RegisterForm);
