import React, { Component } from 'react';
import { bool, func, number, object, shape } from 'prop-types';

import { WithdrawalConfigLayout, PrimaryAccount } from '@catch/common';
import { Box, Spinner, Text } from '@catch/rio-ui-kit';
import { accountRef } from '@catch/utils';

import { BulkWithdrawFundsForm } from '../forms';

class BulkWithdrawConfigurationView extends Component {
  static propTypes = {
    availableBalances: shape({
      taxBalance: number,
      ptoBalance: number,
      retirementBalance: number,
    }).isRequired,
    areFormEntriesValid: shape({
      tax: bool,
      pto: bool,
      retirement: bool,
    }).isRequired,
    onSetStage: func.isRequired,
    STAGES: object.isRequired,
    totalToWithdraw: number.isRequired,
  };
  render() {
    const {
      availableBalances,
      areFormEntriesValid,
      formValues,
      isTotalValid,
      onSetStage,
      STAGES,
      totalToWithdraw,
      breakpoints,
      onBack,
    } = this.props;

    return (
      <WithdrawalConfigLayout
        breakpoints={breakpoints}
        onSubmit={() => onSetStage({ stage: STAGES.confirmation })}
        totalToWithdraw={totalToWithdraw}
        isButtonDisabled={
          !areFormEntriesValid.tax ||
          !areFormEntriesValid.pto ||
          !isTotalValid ||
          totalToWithdraw < 0.01
        }
        onBack={onBack}
        withdrawalView={
          <BulkWithdrawFundsForm
            availableBalances={availableBalances}
            areFormEntriesValid={areFormEntriesValid}
            formValues={formValues}
            initialValues={{
              taxBalance: 0,
              ptoBalance: 0,
              retirementBalance: 0,
            }}
          />
        }
        sendView={
          <PrimaryAccount>
            {({ primaryAccount, loading }) => (
              <Box mb={4}>
                {loading ? (
                  <Spinner />
                ) : (
                  <Text weight="medium">
                    {accountRef({
                      accountName: primaryAccount.name,
                      accountNumber: primaryAccount.accountNumber,
                    })}
                  </Text>
                )}
              </Box>
            )}
          </PrimaryAccount>
        }
      />
    );
  }
}

export default BulkWithdrawConfigurationView;
