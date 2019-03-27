import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import * as sel from '@catch/login/src/store/selectors';

import Main from 'web/layouts/Main';

class AuthenticatedRoute extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

  render() {
    const { component: Component, isAuthenticated, ...rest } = this.props;

    return (
      <Route
        {...rest}
        render={props => {
          const signupCode = props.location.search.split('r=')[1];
          return isAuthenticated ? (
            <Component {...this.props} />
          ) : (
            <Redirect
              to={{
                pathname: signupCode ? '/auth/sign-up' : '/auth/sign-in',
                state: {
                  next: props.location,
                  refCode: signupCode,
                },
              }}
            />
          );
        }}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    isAuthenticated: sel.getIsAuthenticated,
  }),
)(AuthenticatedRoute);
