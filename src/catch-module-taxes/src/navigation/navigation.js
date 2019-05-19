import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  PlanDisclosuresView,
  PlanLegalView,
  PlanIdentityFailureView,
  UploadKycImageView,
  PlanIneligibleUserView,
  PlanRegulatoryView,
  FlowBar,
  planRoute,
  showFlowBar,
  calcProgress,
} from '@catch/common';

import {
  TaxesIntroView,
  TaxesConfirmView,
  TaxesOverviewView,
  TaxesEditView,
} from '../views';

import { ConditionalNavigation as TaxesEstimatorView } from '../containers';

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
            title="Taxes"
            exitPath={planRoute}
            {...calcProgress(steps, location.pathname)}
          />
        )}
        <Switch>
          <Route
            path={`${path}/intro`}
            render={props => <TaxesIntroView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/estimator`}
            render={props => <TaxesEstimatorView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/legal`}
            render={props => (
              <PlanLegalView moduleName="taxes" push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/regulatory`}
            render={props => (
              <PlanRegulatoryView
                moduleName="taxes"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/agreement`}
            render={props => (
              <PlanDisclosuresView
                moduleName="taxes"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/identity-verification`}
            render={props => (
              <UploadKycImageView
                moduleName="taxes"
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
            render={props => <TaxesConfirmView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/overview`}
            render={props => <TaxesOverviewView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/ineligible`}
            render={props => (
              <PlanIneligibleUserView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/edit`}
            render={props => <TaxesEditView push={reduxPush} {...props} />}
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
