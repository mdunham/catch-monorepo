import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createStructuredSelector } from 'reselect';

import {
  Checkbox,
  PageTitle,
  PageWrapper,
  borderRadius,
  Text,
  H1,
  Box,
  Flex,
  Icon,
  Link,
  Spinner,
  Fader,
  withDimensions,
  colors,
  styles,
} from '@catch/rio-ui-kit';
import { Env, goTo, navigationPropTypes } from '@catch/utils';
// @WARNING do not change this import
import { generateRandomUser } from '@catch/utils/src/tests/generateRandomUser';

import { actions } from '../store/duck';
import { SmallContainer, BetaHeader } from '../components';
import * as sel from '../store/selectors';
import { SignInForm } from '../forms';

const PREFIX = 'catch.module.login.SignInView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  signupLabel: <FormattedMessage id={`${PREFIX}.signupLabel`} />,
  signupLink: <FormattedMessage id={`${PREFIX}.signupLink`} />,
};

export class SignInView extends React.Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    location: PropTypes.object,
    isAuthing: PropTypes.bool.isRequired,
    ...navigationPropTypes,
  };

  constructor() {
    super();
    this.state = {
      testUser: false,
    };
    this.goTo = goTo.bind(this);
  }

  componentDidMount() {
    const { saveNavId, componentId } = this.props;
    saveNavId({ componentId });
  }

  handleLogin = values => {
    // Redirect back to whereever user was coming from if they tried to reach an
    // unauthenticated route first
    this.props.signIn({
      values,
      next: Platform.OS === 'web' ? this.nextPath() : undefined,
    });
  };

  handleSignUp = () => {
    this.goTo('/auth/sign-up');
  };

  handleTestSignUp = values => {
    const user = generateRandomUser(values);
    if (!user.email) return;
    this.props.testSignUp({ values: user });
  };

  forgotPassword = () => {
    this.goTo('/auth/forgot-password');
  };

  nextPath() {
    const { next } = this.props.location.state || {
      next: { pathname: '/' },
    };
    return next;
  }

  render() {
    const { isAuthing, viewport, breakpoints } = this.props;
    return (
      <SafeAreaView style={styles.get('Flex1')}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding' })}
          style={styles.get([
            'Flex1',
            breakpoints.select({ PhoneOnly: 'White' }),
          ])}
        >
          {/*
        @NOTE: the ScrollView here is needed in order to let the content flow
        naturally on smaller viewport and gracefully avoid the keyboard
        the `alwaysBounceVertical=false` prop prevents it from bouncing by default
        */}
          <ScrollView
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.get('CenterColumn')}
          >
            <View style={styles.get('WhiteFrame', viewport)}>
              <BetaHeader viewport={viewport} />
              {isAuthing ? (
                <Fader show>
                  <Box align="center" mt={83} mb={100}>
                    <Spinner large />
                  </Box>
                </Fader>
              ) : (
                <Fader show>
                  <SignInForm
                    viewport={viewport}
                    onSubmit={
                      this.state.testUser
                        ? this.handleTestSignUp
                        : this.handleLogin
                    }
                    onNext={this.forgotPassword}
                  />
                </Fader>
              )}
            </View>
            {!isAuthing && (
              <Box align="center" my={40} key="below">
                <Text center mb={1}>
                  {COPY['signupLabel']}
                </Text>
                {Env.isNative ? (
                  <TouchableOpacity onPress={this.handleSignUp}>
                    <Text center color="link" weight="medium">
                      {COPY['signupLink']}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Link to="/auth/sign-up">
                    <Text center color="link" weight="medium">
                      {COPY['signupLink']}
                    </Text>
                  </Link>
                )}
                {Env.isDevLike && (
                  <Box
                    w={160}
                    mt={3}
                    px={2}
                    py={1}
                    dev
                    style={{ borderRadius: borderRadius.regular }}
                  >
                    <Checkbox
                      onChange={() =>
                        this.setState(({ testUser }) => ({
                          testUser: !testUser,
                        }))
                      }
                      checked={this.state.testUser}
                    >
                      <Text color="gray2" size="small" weight="medium">
                        Create test user
                      </Text>
                    </Checkbox>
                  </Box>
                )}
              </Box>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    isAuthing: sel.getIsAuthenticating,
  }),
  {
    signIn: actions.signIn,
    testSignUp: actions.testSignUp,
    saveNavId: actions.saveNavId,
  },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(SignInView);
