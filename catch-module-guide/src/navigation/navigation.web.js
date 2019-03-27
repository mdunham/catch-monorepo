import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { FlowBar } from '@catch/common';

import { GuideCheckupView, GuideView } from '../views';

export const GuideNavigation = ({ match: { path }, reduxPush }) => (
  <Switch>
    <Route
      path={`${path}/checkup`}
      render={props => (
        <React.Fragment>
          <FlowBar title="Benefits checkup" white showProgress={false} />
          <GuideCheckupView {...props} push={reduxPush} />
        </React.Fragment>
      )}
    />
    <Route
      path={`${path}`}
      render={props => <GuideView {...props} push={reduxPush} />}
    />
  </Switch>
);

GuideNavigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export function registerGuideScreens() {}

export default connect(
  null,
  { reduxPush: push },
)(GuideNavigation);
