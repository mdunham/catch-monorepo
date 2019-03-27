import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import PlanView from '@catch/plan';
import TaxesNavigator from '@catch/taxes';
import TimeoffNavigator from '@catch/timeoff';
import RetirementNavigator from '@catch/retirement';
import HealthNavigator from '@catch/health';
import { Env } from '@catch/utils';

class Navigation extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };
  render() {
    const {
      match: { path },
      givenName,
      workType,
    } = this.props;

    return (
      <Switch>
        <Route path={`${path}/taxes`} component={TaxesNavigator} />
        <Route
          path={`${path}/timeoff`}
          render={props => (
            <TimeoffNavigator givenName={givenName} {...props} />
          )}
        />
        <Route path={`${path}/retirement`} component={RetirementNavigator} />
        <Route path={`${path}/health`} component={HealthNavigator} />
        <Route path={`${path}`} component={PlanView} />
      </Switch>
    );
  }
}

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Navigation;
