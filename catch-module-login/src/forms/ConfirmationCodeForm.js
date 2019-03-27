import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';
import { compose } from 'redux';

import {
  colors,
  borderRadius,
  Box,
  ReduxInput,
  Button,
  Text,
  fonts,
} from '@catch/rio-ui-kit';
import { createValidator, confirmationCode } from '@catch/utils';
import { Header, ResendAuthCode } from '../components';

const PREFIX = 'catch.module.login.ConfirmationCodeForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: values => (
    <FormattedMessage id={`${PREFIX}.subtitle`} values={values} />
  ),
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  resendButton: <FormattedMessage id={`${PREFIX}.resendButton`} />,
  CodeMismatchException: (
    <FormattedMessage id={`${PREFIX}.CodeMismatchException`} />
  ),
  Error: <FormattedMessage id={`${PREFIX}.Error`} />,
  successMsg: <FormattedMessage id={`${PREFIX}.successMsg`} />,
};

export class ConfirmationCodeForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    submitError: PropTypes.string,
  };

  render() {
    const {
      viewport,
      invalid,
      handleSubmit,
      submitError,
      emailAddress,
      intl: { formatMessage },
    } = this.props;

    return (
      <React.Fragment>
        <Header
          title={COPY['title']}
          subtitle={COPY['subtitle']({
            emailAddress: (
              <Text size={viewport === 'PhoneOnly' ? 15 : 18} weight="medium">
                {emailAddress}
              </Text>
            ),
          })}
          viewport={viewport}
        />
        <Box row={viewport !== 'PhoneOnly'}>
          <Field
            name="code"
            component={ReduxInput}
            placeholder={formatMessage({
              id: `${PREFIX}.codeInput.placeholder`,
            })}
            style={{
              letterSpacing: 4,
              fontSize: 24,
              textAlign: 'center',
              paddingVertical: 12,
              fontWeight: fonts.medium,
              borderRadius: borderRadius.regular,
              width: viewport === 'PhoneOnly' ? '100%' : 188,
            }}
            props={{
              // We can ignore errors simply by not providing copy
              submitError: submitError ? COPY[submitError] : undefined,
            }}
            confirmable={false}
            keyboardType="number-pad"
            onSubmit={handleSubmit}
          />
          <Box ml={[null, 2, 2]} mt={[null, 1, 1]} mb={[2]} screen={viewport}>
            <Button
              disabled={invalid}
              onClick={handleSubmit}
              style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
            >
              {COPY['submitButton']}
            </Button>
          </Box>
        </Box>
        <ResendAuthCode
          center={viewport === 'PhoneOnly'}
          successMsg={COPY['successMsg']}
        >
          {COPY['resendButton']}
        </ResendAuthCode>
      </React.Fragment>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'ConfirmationCodeForm',
  validate: createValidator(confirmationCode),
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

export default enhance(ConfirmationCodeForm);
