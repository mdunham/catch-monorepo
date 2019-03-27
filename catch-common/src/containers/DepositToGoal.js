/**
 * DepositToGoal
 *
 * This mutation allows a user to deposit funds directly into a goal
 *
 * Required parameters for the mutation:
 * golID (string) -- the goal's id
 * goalType (string) -- the type of goal [TAX, RETIREMENT, PTO]
 * amount (float) -- the amount of money to deposit
 *
 * Optional paramters:
 * description (string) -- text that annotates the deposit
 *
 * A TRUE response means that the deposit was successful
 * A FALSE response means that the deposit failed
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { TRANSFER_FUNDS_QUERY } from './TransferFundsQuery';

const Log = createLogger('deposit-to-goal');

export const DEPOSIT_TO_GOAL = gql`
  mutation DepositToGoal($input: DepositToGoalInput!) {
    depositToGoal(input: $input)
  }
`;

export const DepositToGoal = ({ children, onCompleted }) => (
  <Mutation
    mutation={DEPOSIT_TO_GOAL}
    onCompleted={onCompleted}
    // @TODO reimplement this
    // refetchQueries={[{ query: TRANSFER_FUNDS_QUERY }]}
    // awaitRefetchQueries
  >
    {(depositToGoal, { loading, error }) => {
      if (loading) Log.debug('depositing funds to goal');
      return children({ depositToGoal, depositing: loading, error });
    }}
  </Mutation>
);

DepositToGoal.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default DepositToGoal;
