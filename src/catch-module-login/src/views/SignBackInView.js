import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { Text, PageTitle, Page, withDimensions } from '@catch/rio-ui-kit';
import { actions } from '../store/duck';
import SmallContainer from '../components/SmallContainer';
import * as sel from '../store/selectors';
import { SignInForm } from '../forms';

// Preload for perf and to prevent flash of content
// import HomeView from 'views/HomeView/Async';

const PREFIX = 'catch.module.login.SignBackInView';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export class SignBackInView extends React.Component {
  static propTypes = {
    signIn: PropTypes.func.isRequired,
    location: PropTypes.object,
    isAuthing: PropTypes.bool.isRequired,
  };

  handleLogin = values => {
    const { email } = this.props;
    // Redirect back to whereever user was coming from if they tried to reach an
    // unauthenticated route first
    this.props.signIn({
      values: {
        ...values,
        email,
      },
      next: Platform.OS === 'web' ? this.nextPath() : undefined,
    });
  };

  forgotPassword = () => {
    const {
      navigation: { navigate },
    } = this.props;
    navigate('/auth/forgot-password');
  };

  componentDidMount() {
    // HomeView.preload();
  }

  nextPath() {
    const { next } = this.props.location.state || {
      next: { pathname: '/' },
    };
    return next;
  }

  render() {
    const { isAuthing, viewport, givenName } = this.props;
    return (
      <Page>
        <SmallContainer>
          <PageTitle
            viewport={viewport}
            title={COPY['title']({ name: givenName })}
            subtitle={COPY['subtitle']}
          >
            <Text color="gray2">{COPY['description']}</Text>
          </PageTitle>
          <SignInForm
            noEmail
            form="signBackIn"
            onSubmit={this.handleLogin}
            isAuthing={isAuthing}
            onNext={this.forgotPassword}
          />
        </SmallContainer>
      </Page>
    );
  }
}

const withConnect = connect(
  createStructuredSelector({
    isAuthing: sel.getIsAuthenticating,
    givenName: sel.getLastSignInGivenName,
    email: sel.getLastSignInEmail,
  }),
  { signIn: actions.signIn },
);

const enhance = compose(
  withDimensions,
  withConnect,
);

export default enhance(SignBackInView);
