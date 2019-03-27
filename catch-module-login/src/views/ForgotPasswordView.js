import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { actions } from '../store/duck';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { isInvalid } from 'redux-form';
import {
  Box,
  PageTitle,
  PageWrapper,
  withDimensions,
  colors,
  Spinner,
  styles,
  Button,
} from '@catch/rio-ui-kit';
import { PasswordResetForm } from '../forms';
import { SmallContainer, Header } from '../components';
import * as sel from '../store/selectors';

const PREFIX = 'catch.module.login.ForgotPasswordView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
};

export class ForgotPasswordView extends Component {
  static propTypes = {
    requestReset: PropTypes.func.isRequired,
  };

  handleReset = ({ email }) => {
    this.props.requestReset(email);
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
      isRequesting,
      error,
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
            contentContainerStyle={styles.get('CenterColumn')}
          >
            <View style={styles.get('WhiteFrame', viewport)}>
              {isRequesting ? (
                <Box align="center" mt={83} mb={100}>
                  <Spinner large />
                </Box>
              ) : (
                <React.Fragment>
                  <Header
                    small
                    title={COPY['title']}
                    subtitle={COPY['subtitle']}
                    viewport={viewport}
                  />
                  <PasswordResetForm
                    onSubmit={this.handleReset}
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
                  disabled={isFormInvalid || isRequesting}
                >
                  Reset password
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
    isRequesting: sel.getIsProcessing,
    error: sel.getAuthError,
    isFormInvalid: isInvalid('PasswordResetForm'),
  }),
  { requestReset: actions.requestReset, clearError: actions.clearError },
  // TODO: make that a reusable util function
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
          if (values.email !== previousValues.email) {
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

export default enhance(ForgotPasswordView);
