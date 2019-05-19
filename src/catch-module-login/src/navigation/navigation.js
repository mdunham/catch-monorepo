import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Box } from '@catch/rio-ui-kit';
import { Switch, Redirect, Route } from 'react-router-dom';
import { push, getLocation } from 'react-router-redux';
import { lifecycle } from 'recompose';
import { createStructuredSelector } from 'reselect';

// Views
import {
  SignInView,
  SignBackInView,
  RegisterView,
  WorkView,
  TriageView,
  CodeConfirmationView,
  ForgotPasswordView,
  ConfirmNewPasswordView,
  OnboardingView,
} from '../views';
import * as sel from '../store/selectors';

export const UnauthorizedNavigation = ({
  match: { path },
  push,
  location,
  email,
}) => (
  <Switch>
    <Route
      path={`${path}/sign-in`}
      component={props => <SignInView {...props} push={push} />}
    />
    <Route
      path={`${path}/refresh`}
      render={props =>
        !!email ? (
          <SignBackInView {...props} />
        ) : (
          <Redirect to={`${path}/sign-in`} />
        )
      }
    />
    <Route
      path={`${path}/sign-up`}
      render={props => <OnboardingView {...props} push={push} />}
    />
    <Route
      path={`${path}/forgot-password/confirm`}
      component={ConfirmNewPasswordView}
    />
    <Route path={`${path}/forgot-password`} component={ForgotPasswordView} />
    <Redirect to={`${path}/sign-in`} />
  </Switch>
);

UnauthorizedNavigation.propTypes = {
  match: PropTypes.object.isRequired,
};

// We map navigate function to a router dom push
export const navigate = push;
export const registerAuthScreens = () => {};

export default connect(
  createStructuredSelector({
    email: sel.getLastSignInEmail,
  }),
  { push },
)(UnauthorizedNavigation);
