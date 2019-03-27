import React from 'react';

import { Box, Divider, Spinner } from '@catch/rio-ui-kit';
import { UserInfo, ActionableInfo } from '@catch/common';
import { filingStatusCopy, formatCurrency, STATES } from '@catch/utils';

import { TaxesContextModal } from '../containers';

class TaxesContextView extends React.PureComponent {
  state = {
    showModal: null,
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
  render() {
    return (
      <UserInfo>
        {({
          incomeState,
          filingStatus,
          workType,
          estimatedIncome,
          estimated1099Income,
          estimatedW2Income,
          spouseIncome,
          loading,
          taxPercentage,
        }) =>
          loading ? (
            <Box my={4} align="center">
              <Spinner />
            </Box>
          ) : (
            <Box my={2}>
              <ActionableInfo
                onPress={() => this.openModal('workState')}
                label="Work state"
                value={STATES[incomeState]}
                qaName="workState"
                mb={2}
              />
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
                value={formatCurrency(estimatedIncome || estimated1099Income)}
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
              {typeof this.props.numDependents === 'number' && (
                <ActionableInfo
                  onPress={() => this.openModal('numDependents')}
                  label="Dependents"
                  value={this.props.numDependents}
                  qaName="dependents"
                />
              )}
              <TaxesContextModal
                workState={incomeState}
                filingStatus={filingStatus}
                annualIncome={estimatedIncome}
                workType={workType}
                estimatedW2Income={estimatedW2Income}
                estimated1099Income={estimated1099Income}
                spouseIncome={spouseIncome}
                numDependents={this.props.numDependents}
                showModal={this.state.showModal}
                onClose={this.closeModal}
                paycheckPercentage={taxPercentage}
                incomeState={incomeState}
              />
            </Box>
          )
        }
      </UserInfo>
    );
  }
}

export default TaxesContextView;
