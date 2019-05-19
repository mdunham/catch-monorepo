/**
 * TransferFunds
 *
 * This component maintains the logic for depositing and withdrawing funds from individual goals.
 *
 * To use this component, pass either 'withdraw' or 'deposit' into the transferType prop and use the onTransfer function to handle the funds transfer
 */

import React from 'react';
import PropTypes from 'prop-types';

import DepositToGoal from './DepositToGoal';
import WithdrawGoal from './WithdrawGoal';

export const TransferFunds = ({ children, onCompleted, transferType }) => (
  <DepositToGoal onCompleted={onCompleted}>
    {({ depositToGoal, depositing }) => (
      <WithdrawGoal onCompleted={onCompleted}>
        {({ withdrawGoal, withdrawing }) => {
          const onTransfer =
            transferType === 'withdraw' ? withdrawGoal : depositToGoal;

          const transferring = withdrawing || depositing;

          return children({ onTransfer, transferring });
        }}
      </WithdrawGoal>
    )}
  </DepositToGoal>
);

TransferFunds.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  transferType: PropTypes.oneOf(['deposit', 'withdraw']).isRequired,
};

export default TransferFunds;
