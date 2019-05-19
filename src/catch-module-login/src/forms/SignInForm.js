import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage, injectIntl } from 'react-intl';

import { Box, Button, Link, Text, ReduxInput, styles } from '@catch/rio-ui-kit';
import { Env, createValidator, signInForm } from '@catch/utils';

import { actions } from '../store/duck';

const PREFIX = 'catch.module.login.SignInForm';
export const COPY = {
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  passwordLink: <FormattedMessage id={`${PREFIX}.passwordLink`} />,
  NotAuthorizedException: (
    <FormattedMessage id={`${PREFIX}.NotAuthorizedException`} />
  ),
  UserNotFoundException: (
    <FormattedMessage id={`${PREFIX}.UserNotFoundException`} />
  ),
  DefaultError: <FormattedMessage id={`${PREFIX}.DefaultError`} />,
  'UsernameExistsException.title': (
    <FormattedMessage id={`${PREFIX}.UsernameExistsException.title`} />
  ),
  'UsernameExistsException.subtitle': (
    <FormattedMessage id={`${PREFIX}.UsernameExistsException.subtitle`} />
  ),
  showPw: <FormattedMessage id={`${PREFIX}.showPw`} />,
  hidePw: <FormattedMessage id={`${PREFIX}.hidePw`} />,
};

export class SignInForm extends Component {
  static propTypes = {
    authError: PropTypes.string,
    handleSubmit: PropTypes.func.isRequired,
  };
  state = {
    showPw: false,
  };
  togglePw = () => {
    this.setState({
      showPw: !this.state.showPw,
    });
  };

  render() {
    const {
      noEmail,
      handleSubmit,
      onSubmit,
      isAuthing,
      authError,
      onNext,
      invalid,
      intl: { formatMessage },
      viewport,
    } = this.props;
    const hasError = typeof authError === 'string' && authError.length > 0;
    const emailErr = {
      UserNotFoundException: COPY['UserNotFoundException'],
    };
    const pwErr = {
      NotAuthorizedException: COPY['NotAuthorizedException'],
    };
    const uExistsError = {
      UsernameExistsException: {
        title: COPY['UsernameExistsException.title'],
        subtitle: COPY['UsernameExistsException.subtitle'],
      },
    };

    return (
      <React.Fragment>
        {hasError &&
          !emailErr[authError] &&
          !pwErr[authError] &&
          !uExistsError[authError] && (
            <Text size="small" color="fire" space={-1} mb={2} mt={-24} center>
              {COPY['DefaultError']}
            </Text>
          )}
        {hasError &&
          !!uExistsError[authError] && (
            <Box mb={2} mt={-24} align="center">
              <Text weight="medium" mb={1} center>
                {uExistsError[authError].title}
              </Text>
              <Text size="small" center>
                {uExistsError[authError].subtitle}
              </Text>
            </Box>
          )}
        {!noEmail && (
          <Field
            name="email"
            component={ReduxInput}
            label={formatMessage({ id: `${PREFIX}.emailInput.label` })}
            autoCorrect={false}
            props={{
              // Will be undefined if the error code is not in this object
              submitError: hasError ? emailErr[authError] : undefined,
            }}
            confirmable={false}
            onSubmit={handleSubmit}
            keyboardType="email-address"
          />
        )}
        <Field
          name="password"
          component={ReduxInput}
          type={this.state.showPw ? 'text' : 'password'}
          label={formatMessage({ id: `${PREFIX}.passwordInput.label` })}
          extraLabel={
            <Text
              onClick={this.togglePw}
              color="link"
              size="small"
              weight="medium"
            >
              {this.state.showPw ? COPY['hidePw'] : COPY['showPw']}
            </Text>
          }
          props={{
            submitError: hasError ? pwErr[authError] : undefined,
          }}
          confirmable={false}
          onSubmit={handleSubmit(onSubmit)}
        />
        {!Env.isNative && (
          <Box row mt={1}>
            <Link to="/auth/forgot-password">
              <Text size="small" weight="medium" color="link">
                {COPY['passwordLink']}
              </Text>
            </Link>
          </Box>
        )}
        <Box
          row
          mt={viewport === 'PhoneOnly' ? 2 : 1}
          align="center"
          justify={Env.isNative ? 'center' : noEmail ? 'flex-end' : 'flex-end'}
        >
          <Button
            disabled={invalid}
            loading={isAuthing}
            onClick={handleSubmit(onSubmit)}
            viewport={viewport}
            style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
          >
            {COPY['submitButton']}
          </Button>
        </Box>
        {!noEmail &&
          (Env.isNative && (
            <TouchableOpacity onPress={onNext}>
              <Box mt={2} align="center" justify="center">
                <Text color="link" weight="medium">
                  {COPY['passwordLink']}
                </Text>
              </Box>
            </TouchableOpacity>
          ))}
      </React.Fragment>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'SignInForm',
  validate: createValidator(signInForm),
  // destroyOnUnmount: false,
});

// prepopulate the email field with lastSignInEmail
const withConnect = connect(
  ({ authentication }) => ({
    initialValues: {
      email: authentication.userContext.email,
    },
    authError: authentication.error,
  }),
  actions,
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    /**
     * if there's an error from cognito we want to clear it when the user
     * changes the values again
     */
    onChange: stateProps.authError
      ? (values, dispatch, props, previousValues) => {
          if (
            (values.email !== previousValues.email ||
              values.password !== previousValues.password) &&
            stateProps.authError !== 'UsernameExistsException'
          ) {
            dispatchProps.clearError();
          }
        }
      : undefined,
  }),
);

const enhance = compose(
  injectIntl,
  withConnect,
  withReduxForm,
);

export default enhance(SignInForm);
