import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { push, replace } from 'react-router-redux';
import { connect } from 'react-redux';

import { Page } from '@catch/rio-ui-kit';
import { PlanVerifyIdentityView, UploadKycImageView } from '@catch/common';

import {
  PlanBuilderIntroView,
  BulkEditPlanView,
  HealthOverviewView,
  PlanLineupView,
} from '../views';
import PlanTabs from './PlanTabs';

/**
 * We can add some plan specific navigation.
 * Plan flows are handled separately from both environments.
 * @NOTE: we render the plan view initially on the main route
 */
const Navigation = ({ match: { path }, reduxPush, replace }) => (
  <Switch>
    <Route
      path="/plan/identity-verification"
      render={props => <PlanVerifyIdentityView push={reduxPush} {...props} />}
    />
    <Route
      path="/plan/upload-identification"
      render={props => <UploadKycImageView push={reduxPush} {...props} />}
    />
    <Route
      path="/plan/manage"
      render={props => <BulkEditPlanView push={reduxPush} {...props} />}
    />
    <Route
      path="/plan/coming-soon"
      render={props => <PlanLineupView push={reduxPush} {...props} />}
    />
    <Route
      path="/plan"
      render={props => (
        <PlanTabs push={reduxPush} replace={replace} {...props} />
      )}
    />
    <Route
      path="/"
      exact
      render={props => <PlanTabs push={reduxPush} {...props} />}
    />
  </Switch>
);

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default connect(
  undefined,
  { reduxPush: push, replace },
)(Navigation);
