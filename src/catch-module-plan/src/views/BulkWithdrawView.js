import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { BulkWithdrawFunds } from '../containers';
import {
  Box,
  Flex,
  Text,
  H3,
  Button,
  Spinner,
  withDimensions,
} from '@catch/rio-ui-kit';
import { ensureZero, formatCurrency } from '@catch/utils';
import { TransferFundsSuccessView } from '@catch/common';
import { Error, ErrorBoundary, ErrorMessage } from '@catch/errors';

import { BulkWithdrawFundsForm } from '../forms';
import BulkWithdrawConfigurationView from './BulkWithdrawConfigurationView';
import BulkWithdrawConfirmationView from './BulkWithdrawConfirmationView';

class BulkWithdrawView extends Component {
  render() {
    const { toggleParentModal, viewport, breakpoints } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <BulkWithdrawFunds navigation={this.props.navigation}>
          {({
            initialValuesError,
            initialValuesLoading,
            availableBalances,
            areFormEntriesValid,
            currentStage,
            formValues,
            handleWithdrawal,
            isTotalValid,
            onSetStage,
            totalToWithdraw,
            STAGES,
          }) => {
            if (!!initialValuesLoading) {
              return <Spinner />;
            } else if (initialValuesError) {
              return <Error>{initialValuesError}</Error>;
            } else {
              switch (currentStage) {
                case STAGES.fillingIn:
                  return (
                    <BulkWithdrawConfigurationView
                      availableBalances={availableBalances}
                      areFormEntriesValid={areFormEntriesValid}
                      formValues={formValues}
                      isTotalValid={isTotalValid}
                      onSetStage={onSetStage}
                      STAGES={STAGES}
                      totalToWithdraw={totalToWithdraw}
                      isMobile={isMobile}
                      breakpoints={breakpoints}
                      onBack={toggleParentModal}
                    />
                  );

                case STAGES.confirmation:
                  return (
                    <BulkWithdrawConfirmationView
                      amountToWithdraw={totalToWithdraw}
                      availableBalances={availableBalances}
                      formValues={formValues}
                      onBack={() => onSetStage({ stage: STAGES.fillingIn })}
                      onSetStage={onSetStage}
                      onWithdraw={handleWithdrawal}
                      isMobile={isMobile}
                      breakpoints={breakpoints}
                    />
                  );

                case STAGES.success:
                  return (
                    <TransferFundsSuccessView
                      toggleParentModal={toggleParentModal}
                      breakpoints={breakpoints}
                      transferType="withdraw"
                    />
                  );
                case STAGES.error:
                  // @NOTE: per a discussion with Zack and Alvin on 8/15/18, the
                  // backend is going to swallow any BBVA errors and we're doing
                  // to treat most withdrawals as if they succeeded. This error
                  // case only pertains to if there's an error with one of our
                  // internal services. Thus, the likelihood of ever hitting this
                  // error state is minimal at best
                  return <ErrorMessage />;
              }
            }
          }}
        </BulkWithdrawFunds>
      </ErrorBoundary>
    );
  }
}

export default withDimensions(BulkWithdrawView);
