import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {
  Box,
  Text,
  PageTitle,
  PageWrapper,
  withDimensions,
  Spinner,
  colors,
  styles,
  Button,
} from '@catch/rio-ui-kit';
import { isInvalid } from 'redux-form';

import { PasswordResetConfirmationForm } from '../forms';
import { SmallContainer, Header } from '../components';
import { actions } from '../store/duck';
import * as sel from '../store/selectors';

const PREFIX = 'catch.module.login.ConfirmNewPasswordView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p: values => <FormattedMessage id={`${PREFIX}.p`} values={values} />,
};

export class ConfirmNewPasswordView extends Component {
  static propTypes = {
    confirmReset: PropTypes.func.isRequired,
  };

  handleConfirmation = ({ code, newPassword }) => {
    this.props.confirmReset({ code, newPassword });
  };

  handleFormRef = el => {
    this.form = el;
  };

  handleSubmit = () => {
    if (this.form) {
      this.form.submit();
    }
  };

  render() {
    const {
      viewport,
      breakpoints,
      error,
      isResetting,
      emailAddress,
      onChange,
      isFormInvalid,
    } = this.props;
    return (
      <SafeAreaView style={styles.get('Flex1')}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding' })}
          style={styles.get([
            'Flex1',
            breakpoints.select({ PhoneOnly: 'White' }),
          ])}
        >
          <ScrollView
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.get([
              'CenterColumn',
              'LgBottomGutter',
            ])}
          >
            <View style={styles.get('WhiteFrame', viewport)}>
              {isResetting ? (
                <Box align="center" mt={83} mb={100}>
                  <Spinner large />
                </Box>
              ) : (
                <React.Fragment>
                  <Header
                    small
                    title={COPY['title']}
                    subtitle={COPY['p']({
                      emailAddress: <Text weight="medium">{emailAddress}</Text>,
                    })}
                    viewport={viewport}
                  />
                  <PasswordResetConfirmationForm
                    onSubmit={this.handleConfirmation}
                    viewport={viewport}
                    authError={error}
                    onChange={onChange}
                    ref={this.handleFormRef}
                  />
                </React.Fragment>
              )}
            </View>
          </ScrollView>
          {/* @NOTE: this button is inside the form component in desktop viewports */}
          {breakpoints.select({
            PhoneOnly: (
              <Box
                absolute="vodka"
                style={{ left: 0, right: 0, bottom: 0, height: 72 }}
                p={2}
              >
                <Button
                  wide
                  onClick={this.handleSubmit}
                  disabled={isFormInvalid || isResetting}
                >
                  Confirm
                </Button>
              </Box>
            ),
          })}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    emailAddress: sel.getPWRequestEmail,
    isResetting: sel.getIsAuthenticating,
    error: sel.getAuthError,
    isFormInvalid: isInvalid('PasswordResetConfirmationForm'),
  }),
  { confirmReset: actions.confirmReset, clearError: actions.clearError },
  (stateProps, dispatchProps, ownProps) => ({
    ...stateProps,
    ...ownProps,
    ...dispatchProps,
    /**
     * if there's an error from cognito we want to clear it when the user
     * changes the values again
     */
    onChange: stateProps.error
      ? (values, dispatch, props, previousValues) => {
          if (
            values.code !== previousValues.code ||
            values.newPassword !== previousValues.newPassword
          ) {
            dispatchProps.clearError();
          }
        }
      : undefined,
  }),
);
const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(ConfirmNewPasswordView);
