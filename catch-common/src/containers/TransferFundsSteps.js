/**
 * TransferFundsSteps (questionable name, i know)
 *
 * This component handles the logic for going through each of the steps it takes to deposit/withdraw funds from Catch.
 * This component assumes that the transfer view has been triggered/navigated within a specific vertical
 * and that the user has chosen one of the two options
 */

import React from 'react';
import PropTypes from 'prop-types';

import { accountRef } from '@catch/utils';

import {
  TransferFundsConfigView,
  TransferFundsConfirmView,
  TransferFundsSuccessView,
} from '../views';
import { GOAL_ACCOUNTS } from '../utils';

export const TransferFundsSteps = ({
  setTransferStep,
  transferStage,
  transferring,
  onTransfer,
  transferType,
  goalType,
  goalBalances,
  toggleParentModal,
  ...rest
}) => {
  switch (transferStage) {
    case 'success':
      return (
        <TransferFundsSuccessView
          transferType={transferType}
          toggleParentModal={toggleParentModal}
          {...rest}
        />
      );
    case 'confirm':
      return (
        <TransferFundsConfirmView
          goalType={goalType}
          goalBalances={goalBalances}
          onBack={() =>
            setTransferStep({
              transferStage: 'config',
              transferType: transferType,
            })
          }
          transferType={transferType}
          isLoading={transferring}
          onTransfer={onTransfer}
          // @NOTE: this rest operator has the form values from TransferFundsView and all of the query props from TransferFundsQuery container
          {...rest}
        />
      );
    case 'config':
    default:
      return (
        <TransferFundsConfigView
          goalType={goalType}
          goalBalances={goalBalances}
          onBack={() => setTransferStep({ transferType: null })}
          transferType={transferType}
          onNext={() =>
            setTransferStep({
              transferType: transferType,
              transferStage: 'confirm',
            })
          }
          // @NOTE: this rest operator has the form values from TransferFundsView and all of the query props from TransferFundsQuery container
          {...rest}
        />
      );
  }
};

TransferFundsSteps.propTypes = {
  goalBalances: PropTypes.object,
  goalType: PropTypes.string.isRequired,
  primaryAccountName: PropTypes.string.isRequired,
  primaryAccountNumber: PropTypes.string.isRequired,
  setTransferStep: PropTypes.func.isRequired,
  toggleParentModal: PropTypes.func.isRequired,
  transferStage: PropTypes.string.isRequired,
  transferType: PropTypes.string.isRequired,
};

export default TransferFundsSteps;
