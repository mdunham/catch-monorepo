import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { lifecycle } from 'recompose';

// Views
import {
  PaycheckIntroView,
  PaycheckTriageView,
  PaycheckBreakdownView,
  PaycheckRejectionView,
} from '../views';

import { ProcessIncomeTransaction } from '../containers';

const PaycheckNavigator = ({
  match: {
    path,
    params: { paycheckId },
  },
  reduxPush,
}) => (
  <Switch>
    <Route
      path={`${path}/breakdown`}
      render={props => (
        <PaycheckBreakdownView
          {...props}
          paycheckId={paycheckId}
          push={reduxPush}
        />
      )}
    />
    <Route
      path={`${path}/triage`}
      render={props => (
        <PaycheckTriageView
          {...props}
          paycheckId={paycheckId}
          push={reduxPush}
        />
      )}
    />
    <Route
      path={`${path}/reject`}
      render={props => (
        <PaycheckRejectionView
          {...props}
          paycheckId={paycheckId}
          push={reduxPush}
        />
      )}
    />
    <Route
      path={`${path}/`}
      render={props => (
        <PaycheckIntroView
          {...props}
          paycheckId={paycheckId}
          push={reduxPush}
        />
      )}
    />
  </Switch>
);

PaycheckNavigator.propTypes = {
  match: PropTypes.object.isRequired,
};

export function registerPaycheckScreens() {}

export default connect(
  undefined,
  { reduxPush: push },
)(PaycheckNavigator);
