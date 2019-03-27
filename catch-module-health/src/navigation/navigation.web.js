import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import { FlowBar, calcProgress } from '@catch/common';

import {
  AddDoctorsView,
  EditDoctorView,
  HealthInsuranceView,
  HealthIntroView,
  HealthSupportView,
  HealthLifeEventsView,
  HealthDependentsView,
  HealthIncomeView,
  HealthPeopleView,
  HealthEstimateView,
  HealthPlanListView,
  HealthEnrollmentView,
  HealthExitView,
  WalletInputView,
  WalletSurveyView,
} from '../views';

function showFlowBar(path) {
  return /support|life-events|dependents|people|income|estimate|enroll|exit/.test(
    path,
  );
}

function showWalletFlowBar(path) {
  return /\/plan\/health\/wallet/.test(path);
}

const steps = [
  'support',
  'life-events',
  'dependents',
  'income',
  'people',
  'estimate',
  'plans',
  'enroll',
];

const walletSteps = ['/wallet/intro', '/wallet/add', '/wallet/add-doctors'];

export const HealthNavigation = ({ match: { path }, location, push }) => (
  <React.Fragment>
    {showFlowBar(location.pathname) && (
      <FlowBar
        title="Health Explorer"
        exitPath="/guide"
        showProgress={!/exit/.test(location.pathname)}
        {...calcProgress(steps, location.pathname)}
      />
    )}
    {showWalletFlowBar(location.pathname) && (
      <FlowBar
        white
        exitPath="/guide"
        showProgress={false}
        title="Health insurance details"
        {...calcProgress(walletSteps, location.pathname)}
      />
    )}
    <Switch>
      <Route
        path={`${path}/exit`}
        render={props => <HealthExitView {...props} push={push} />}
      />
      <Route
        path={`${path}/enroll`}
        render={props => <HealthEnrollmentView {...props} push={push} />}
      />
      <Route
        path={`${path}/plans/:planID`}
        render={props => <HealthPlanListView {...props} push={push} />}
      />
      <Route
        path={`${path}/plans`}
        render={props => <HealthPlanListView {...props} push={push} />}
      />
      <Route
        path={`${path}/estimate`}
        render={props => <HealthEstimateView {...props} push={push} />}
      />
      <Route
        path={`${path}/income`}
        render={props => <HealthIncomeView {...props} push={push} />}
      />
      <Route
        path={`${path}/people`}
        render={props => <HealthPeopleView {...props} push={push} />}
      />
      <Route
        path={`${path}/dependents`}
        render={props => <HealthDependentsView {...props} push={push} />}
      />
      <Route
        path={`${path}/life-events`}
        render={props => <HealthLifeEventsView {...props} push={push} />}
      />
      <Route
        path={`${path}/support`}
        render={props => <HealthSupportView {...props} push={push} />}
      />
      <Route
        path={`${path}/intro`}
        render={props => <HealthIntroView {...props} push={push} />}
      />
      <Route
        path={`${path}/wallet/intro`}
        render={props => <WalletSurveyView {...props} push={push} />}
      />
      <Route
        path={`${path}/wallet/add`}
        render={props => <WalletInputView {...props} push={push} />}
      />
      <Route
        path={`${path}/wallet/add-doctors`}
        render={props => <AddDoctorsView {...props} push={push} />}
      />
      <Route
        path={`${path}/overview`}
        render={props => <HealthInsuranceView {...props} push={push} />}
      />
      <Route
        path={`${path}/wallet/edit`}
        render={props => <WalletInputView {...props} isEditing push={push} />}
      />
      <Route
        path={`${path}/wallet/edit-doctor`}
        render={props => <EditDoctorView {...props} push={push} />}
      />
    </Switch>
  </React.Fragment>
);

export function registerHealthScreens() {}

export default connect(
  null,
  { push },
)(HealthNavigation);
