import React, { Component, Fragment } from 'react';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  TransferFundsView,
  WithdrawalModal,
  PlanDetailView,
} from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { TimeOffGoal } from '../containers';

const PREFIX = 'catch.module.timeoff.TimeoffOverviewView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  status: <FormattedMessage id={`${PREFIX}.status`} />, //Add status.{statusType} etc
};

class OverviewView extends Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  state = { isTransferring: false };

  handleEdit = () => {
    this.goTo('/plan/timeoff/edit');
  };
  toggleTransfer = () => {
    if (Platform.OS === 'web') {
      this.setState({ isTransferring: !this.state.isTransferring });
    } else {
      this.goTo('/plan/transfer', { goalType: 'PTO' });
    }
  };

  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TimeOffGoal>
          {({
            availableBalance,
            paycheckPercentage,
            totalTarget,
            status,
            loading,
            error,
            refetch,
            isAccountReady,
          }) => (
            <Fragment>
              <PlanDetailView
                balance={availableBalance}
                title={COPY['title']}
                loading={loading}
                error={error}
                onTrack={COPY['status']}
                paycheckPercentage={paycheckPercentage}
                daysNumber={totalTarget}
                onEdit={this.handleEdit}
                onTransfer={this.toggleTransfer}
                goalStatus={status}
                icon="timeoff"
                goalType="pto"
                goTo={this.goTo}
                goalName="Time Off"
                isAccountReady={isAccountReady}
              />

              {this.state.isTransferring && (
                <WithdrawalModal onRequestClose={this.toggleTransfer}>
                  <TransferFundsView
                    goalType="PTO"
                    toggleParentModal={this.toggleTransfer}
                    refetch={refetch}
                  />
                </WithdrawalModal>
              )}
            </Fragment>
          )}
        </TimeOffGoal>
      </ErrorBoundary>
    );
  }
}

export default OverviewView;
