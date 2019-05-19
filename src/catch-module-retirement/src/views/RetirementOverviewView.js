import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import {
  TransferFundsView,
  PlanDetailView,
  WithdrawalModal,
} from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { CenterFrame, Spinner } from '@catch/rio-ui-kit';

import { RetirementGoal } from '../containers';
import { accountTypes } from '../utils';
import OverviewDetailsView from './OverviewDetailsView';

const PREFIX = 'catch.module.retirement.RetirementOverviewView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
};

export class RetirementOverviewView extends Component {
  static propTypes = {
    ...navigationPropTypes,
  };

  state = { isTransferring: false };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleEdit = () => {
    this.goTo('/plan/retirement/edit');
  };
  toggleTransfer = () => {
    if (Platform.OS === 'web') {
      this.setState({ isTransferring: !this.state.isTransferring });
    } else {
      this.goTo('/plan/transfer', { goalType: 'RETIREMENT' });
    }
  };

  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementGoal>
          {({
            loading,
            error,
            refetch,
            currentPaycheckPercentage,
            status,
            accountType,
            portfolioName,
            portfolioID,
            balance,
            growth,
            showGrowth,
            growthDirection,
            isSavingsAccountReady,
            accountFullyFunded,
            isAccountLocked,
          }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <React.Fragment>
                <PlanDetailView
                  loading={loading}
                  error={error}
                  paycheckPercentage={currentPaycheckPercentage}
                  onEdit={this.handleEdit}
                  onTransfer={this.toggleTransfer}
                  title="Retirement"
                  goalStatus={status}
                  icon="retirement"
                  goalType="retirement"
                  goTo={this.goTo}
                  goalName="Retirement"
                  balance={balance}
                  growth={growth}
                  showGrowth={showGrowth}
                  growthDirection={growthDirection}
                  isAccountReady={isSavingsAccountReady} // allow users in the pending provider state to contribute money towards retirement
                  accountFullyFunded={accountFullyFunded}
                >
                  <OverviewDetailsView
                    accountType={accountType && accountTypes[accountType].label}
                    portfolioName={portfolioName}
                    portfolioID={portfolioID}
                    goTo={this.goTo}
                  />
                </PlanDetailView>
                {this.state.isTransferring && (
                  <WithdrawalModal onRequestClose={this.toggleTransfer}>
                    <TransferFundsView
                      goalType="RETIREMENT"
                      toggleParentModal={this.toggleTransfer}
                      refetch={refetch}
                    />
                  </WithdrawalModal>
                )}
              </React.Fragment>
            )
          }
        </RetirementGoal>
      </ErrorBoundary>
    );
  }
}

export default RetirementOverviewView;
