/**
 * WithdrawGoal
 *
 * This mutation allows a user to withdraw funds from a goal
 *
 * Required parameters for the mutation:
 * golID (string) -- the goal's id
 * goalType (string) -- the type of goal [TAX, RETIREMENT, PTO]
 * amount (float) -- the amount of money to deposit
 *
 * Optional paramters:
 * description (string) -- text that annotates the withdrawal
 *
 * A TRUE response means that the withdrawal was successful
 * A FALSE response means that the withdrawal failed
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { TRANSFER_FUNDS_QUERY } from './TransferFundsQuery';

const Log = createLogger('withdraw-goal');

export const WITHDRAW_GOAL = gql`
  mutation WithdrawGoal($input: WithdrawGoalInput!) {
    withdrawGoal(input: $input)
  }
`;

export const WithdrawGoal = ({ children, onCompleted }) => (
  <Mutation
    mutation={WITHDRAW_GOAL}
    onCompleted={onCompleted}
    // @TODO: reimplement this
    // refetchQueries={[{ query: TRANSFER_FUNDS_QUERY }]}
    // awaitRefetchQueries
  >
    {(withdrawGoal, { loading, error }) => {
      if (loading) Log.debug('withdrawing funds from goal');
      return children({
        withdrawGoal,
        withdrawing: loading,
        error,
      });
    }}
  </Mutation>
);

WithdrawGoal.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default WithdrawGoal;
