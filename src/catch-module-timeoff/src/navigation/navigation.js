import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Switch, Redirect, Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import {
  PlanDisclosuresView,
  PlanLegalView,
  PlanIdentityFailureView,
  PlanIneligibleUserView,
  PlanRegulatoryView,
  UploadKycImageView,
  FlowBar,
  planRoute,
  showFlowBar,
  calcProgress,
} from '@catch/common';

import { ConditionalNavigation as TimeoffEstimatorView } from '../containers';

import {
  TimeoffIntroView,
  TimeoffConfirmView,
  TimeoffOverviewView,
  TimeoffEditView,
} from '../views';

class Navigation extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    reduxPush: PropTypes.func.isRequired,
  };

  render() {
    const {
      match: { path },
      location,
      reduxPush,
      givenName,
    } = this.props;
    // TODO: check when all the legal stuff has been completed
    const steps = [
      'estimator',
      'legal',
      'agreement',
      'identity-verification',
      'regulatory',
      'confirm',
    ];
    return (
      <Fragment>
        {showFlowBar(path, location.pathname) && (
          <FlowBar
            title="Time Off Plan"
            exitPath={planRoute}
            {...calcProgress(steps, location.pathname)}
          />
        )}
        <Switch>
          <Route
            path={`${path}/intro`}
            render={props => (
              <TimeoffIntroView
                push={reduxPush}
                givenName={givenName}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/estimator`}
            render={props => (
              <TimeoffEstimatorView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/legal`}
            render={props => (
              <PlanLegalView moduleName="timeoff" push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/agreement`}
            render={props => (
              <PlanDisclosuresView
                moduleName="timeoff"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/identity-verification`}
            render={props => (
              <UploadKycImageView
                moduleName="timeoff"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/regulatory`}
            render={props => (
              <PlanRegulatoryView
                moduleName="timeoff"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/access-denied`}
            render={props => (
              <PlanIdentityFailureView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/confirm`}
            render={props => <TimeoffConfirmView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/overview`}
            render={props => (
              <TimeoffOverviewView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/ineligible`}
            render={props => (
              <PlanIneligibleUserView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/edit`}
            render={props => <TimeoffEditView push={reduxPush} {...props} />}
          />
        </Switch>
      </Fragment>
    );
  }
}

Navigation.propTypes = {
  match: PropTypes.object.isRequired,
};

export default connect(
  undefined,
  { reduxPush: push },
)(Navigation);
