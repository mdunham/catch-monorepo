import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import { CenterFrame, Spinner } from '@catch/rio-ui-kit';
import {
  WithdrawalModal,
  PlanDetailView,
  TransferFundsView,
} from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { TaxGoal } from '../containers';
import AdjustTaxesView from './AdjustTaxesView';
import TaxesContextView from './TaxesContextView';

const PREFIX = 'catch.module.taxes.TaxesOverviewView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  'modal.title': <FormattedMessage id={`${PREFIX}.modal.title`} />,
  link: <FormattedMessage id={`${PREFIX}.link`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
};

class OverviewView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  state = { isEditing: false, isTransferring: false };

  toggleEdit = () => {
    this.setState({ isEditing: !this.state.isEditing });
  };
  toggleTransfer = () => {
    if (Platform.OS === 'web') {
      this.setState({ isTransferring: !this.state.isTransferring });
    } else {
      this.goTo('/plan/transfer', { goalType: 'TAX' });
    }
  };
  handleEdit = () => {
    if (Platform.OS === 'web') {
      this.toggleEdit();
    } else {
      this.goTo('/plan/taxes/edit');
    }
  };

  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TaxGoal>
          {({ taxGoal, loading, error, refetch, isAccountReady }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <React.Fragment>
                <PlanDetailView
                  loading={loading}
                  error={error}
                  title={COPY['title']}
                  balance={taxGoal.availableBalance}
                  paycheckPercentage={taxGoal.paycheckPercentage}
                  onEdit={this.handleEdit}
                  onTransfer={this.toggleTransfer}
                  goalStatus={taxGoal.status}
                  icon="tax"
                  goalType="tax"
                  goTo={this.goTo}
                  goalName="Taxes"
                  isAccountReady={isAccountReady}
                >
                  <TaxesContextView numDependents={taxGoal.numDependents} />
                </PlanDetailView>

                {this.state.isEditing && (
                  <AdjustTaxesView toggleModal={this.toggleEdit} />
                )}

                {this.state.isTransferring && (
                  <WithdrawalModal onRequestClose={this.toggleTransfer}>
                    <TransferFundsView
                      goalType="TAX"
                      toggleParentModal={this.toggleTransfer}
                      refetch={refetch}
                    />
                  </WithdrawalModal>
                )}
              </React.Fragment>
            )
          }
        </TaxGoal>
      </ErrorBoundary>
    );
  }
}

export default OverviewView;
