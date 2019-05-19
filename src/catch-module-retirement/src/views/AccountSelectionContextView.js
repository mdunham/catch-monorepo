/**
 * This desperately needs to refactored along with
 * TaxesContextView to be a singular entity in @catch/common, where it
 * can function autonomously anywhere in the app
 */

import React from 'react';
import PropTypes from 'prop-types';

import { Box, Spinner } from '@catch/rio-ui-kit';
import { filingStatusCopy, formatCurrency, createLogger } from '@catch/utils';
import { UserFilingMetrics, ActionableInfo } from '@catch/common';

import { AccountSelectionContextModal } from '../containers';
import RothWarningView from './RothWarningView';
import UpdateTaxGoalView from './UpdateTaxGoalView';

const Log = createLogger('retirement-context-view');

export class AccountSelectionContextView extends React.Component {
  static propTypes = {
    showContextDetails: PropTypes.bool,
  };

  state = {
    showModal: null,
    filingMetricsChanged: false,
  };

  openModal = modal => {
    this.setState({
      showModal: modal,
    });
  };

  closeModal = _ => {
    this.setState({
      showModal: null,
    });
  };

  // any time we have sequential modal renderings, there comes a race condition issue (thus, async/await)
  closeModalWithChanges = async _ => {
    try {
      await this.setState({
        showModal: null,
      });
      this.setState({ filingMetricsChanged: true });
    } catch (e) {
      Log.error(e);
    }
  };

  closeTaxModal = _ => {
    this.setState({ filingMetricsChanged: false });
  };

  render() {
    const { showContextDetails } = this.props;

    return (
      <UserFilingMetrics>
        {({
          loading,
          workType,
          estimatedW2Income,
          estimated1099Income,
          filingStatus,
          hasTaxGoal,
          estimatedIncome,
          spouseIncome,
          householdIncome,
        }) =>
          loading ? (
            <Box my={4} align="center">
              <Spinner />
            </Box>
          ) : (
            <Box my={2}>
              {showContextDetails && (
                <React.Fragment>
                  <ActionableInfo
                    onPress={() => this.openModal('filingStatus')}
                    label="Your tax filing status"
                    value={filingStatusCopy[filingStatus]}
                    qaName="filingStatus"
                    mb={2}
                  />
                  <ActionableInfo
                    onPress={() => this.openModal('annualIncome')}
                    label="Your estimated annual income"
                    value={formatCurrency(estimatedIncome)}
                    qaName="estimatedAnnualIncome"
                    mb={2}
                  />
                  {filingStatus === 'MARRIED' && (
                    <ActionableInfo
                      onPress={() => this.openModal('filingStatus')}
                      label="Spouse's estimated annual income"
                      value={formatCurrency(spouseIncome)}
                      qaName="spouseIncome"
                      mb={2}
                    />
                  )}
                </React.Fragment>
              )}
              <AccountSelectionContextModal
                workType={workType}
                filingStatus={filingStatus}
                annualIncome={estimatedIncome}
                estimatedW2Income={estimatedW2Income}
                estimated1099Income={estimated1099Income}
                spouseIncome={spouseIncome}
                showModal={this.state.showModal}
                onClose={this.closeModal}
                onCloseWithChanges={this.closeModalWithChanges}
              />
              <RothWarningView
                householdIncome={householdIncome}
                filingStatus={filingStatus}
                toggleIncomeModal={() => this.openModal('all')}
              />

              {hasTaxGoal &&
                this.state.filingMetricsChanged && (
                  <UpdateTaxGoalView toggleModal={this.closeTaxModal} />
                )}
            </Box>
          )
        }
      </UserFilingMetrics>
    );
  }
}

export default AccountSelectionContextView;
