import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Switch, Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';
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
  UserInfo,
} from '@catch/common';

import {
  RetirementIntroView,
  RiskLevelView,
  PortfolioSelectionView,
  AccountSelectionView,
  RetirementConfirmView,
  RetirementOverviewView,
  RiskComfortView,
  SavingsView,
  FolioAgreementView,
  RetirementEditView,
  ChangePortfolioView,
} from '../views';

import { ConditionalNavigation as RetirementEstimatorView } from '../containers';

export class Navigation extends Component {
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
      'current-savings',
      'risk-comfort',
      'risk-level',
      'portfolio',
      'account',
      'estimator',
      'legal',
      'agreement',
      'investment-agreement',
      'identity-verification',
      'regulatory',
      'confirm',
    ];
    return (
      <Fragment>
        {showFlowBar(path, location.pathname) && (
          <FlowBar
            title="Retirement"
            exitPath={planRoute}
            {...calcProgress(steps, location.pathname)}
          />
        )}
        <Switch>
          <Route
            path={`${path}/intro`}
            render={props => (
              <RetirementIntroView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/current-savings`}
            render={props => <SavingsView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/estimator`}
            render={props => (
              <RetirementEstimatorView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/legal`}
            render={props => (
              <PlanLegalView
                moduleName="retirement"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/agreement`}
            render={props => (
              <PlanDisclosuresView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/investment-agreement`}
            render={props => <FolioAgreementView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/identity-verification`}
            render={props => (
              <UploadKycImageView
                moduleName="retirement"
                push={reduxPush}
                {...props}
              />
            )}
          />
          <Route
            path={`${path}/regulatory`}
            render={props => (
              <PlanRegulatoryView
                moduleName="retirement"
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
            path={`${path}/risk-level`}
            render={props => <RiskLevelView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/risk-comfort`}
            render={props => <RiskComfortView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/portfolio`}
            render={props => (
              <PortfolioSelectionView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/account`}
            render={props => (
              <AccountSelectionView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/confirm`}
            render={props => (
              <RetirementConfirmView push={reduxPush} {...props} />
            )}
          />
          <Route
            path={`${path}/overview`}
            render={props => (
              <RetirementOverviewView push={reduxPush} {...props} />
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
            render={props => <RetirementEditView push={reduxPush} {...props} />}
          />
          <Route
            path={`${path}/change-portfolio`}
            render={props => (
              <ChangePortfolioView push={reduxPush} {...props} />
            )}
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
