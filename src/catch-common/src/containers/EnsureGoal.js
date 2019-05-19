import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('ensure-goal');

export const ENSURE_TAX = gql`
  mutation EnsureTaxGoal($goalID: ID!) {
    ensureTaxGoal(goalID: $goalID) {
      goalStatus
      kycNeeded
    }
  }
`;

export const ENSURE_PTO = gql`
  mutation EnsurePTOGoal($goalID: ID!) {
    ensurePTOGoal(goalID: $goalID) {
      goalStatus
      kycNeeded
    }
  }
`;

export const ENSURE_RETIREMENT = gql`
  mutation EnsureRetirementGoal($goalID: ID!) {
    ensureRetirementGoal(goalID: $goalID) {
      goalStatus
      kycNeeded
    }
  }
`;

const mutations = {
  Tax: ENSURE_TAX,
  PTO: ENSURE_PTO,
  Retirement: ENSURE_RETIREMENT,
};

export const EnsureGoal = ({
  goalName,
  children,
  onCompleted,
  refetchQueries,
}) => (
  <Mutation
    mutation={mutations[goalName]}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
  >
    {(ensureGoal, { loading, error }) => {
      if (loading) Log.debug('Loading...');
      if (error) Log.debug(error);
      return children({ ensureGoal, ensuring: loading, ensureError: error });
    }}
  </Mutation>
);

export default EnsureGoal;
