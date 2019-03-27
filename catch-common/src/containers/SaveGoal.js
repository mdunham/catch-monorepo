import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-goal');

export const SAVE_TAX = gql`
  mutation SaveTaxGoal($input: TaxGoalInput!) {
    upsertTaxGoal(input: $input) {
      id
      status
      isAccountReady
      paycheckPercentage
    }
  }
`;

export const SAVE_PTO = gql`
  mutation SavePTOGoal($input: PTOGoalInput!) {
    upsertPTOGoal(input: $input) {
      id
      status
      isAccountReady
      paycheckPercentage
    }
  }
`;

export const SAVE_RETIREMENT = gql`
  mutation SaveRetirementGoal($input: RetirementGoalInput!) {
    upsertRetirementGoal(input: $input) {
      id
      status
      isAccountReady
      paycheckPercentage
    }
  }
`;

const mutations = {
  Tax: SAVE_TAX,
  PTO: SAVE_PTO,
  Retirement: SAVE_RETIREMENT,
};

const SaveGoal = ({
  goalName,
  children,
  onCompleted,
  refetchQueries,
  variables,
}) => (
  <Mutation
    variables={variables}
    mutation={mutations[goalName]}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
  >
    {(saveGoal, { loading, error }) => {
      if (loading) Log.debug('Loading...');
      if (error) Log.debug(error);
      return children({
        saveGoal,
        saving: loading,
        saveError: error,
      });
    }}
  </Mutation>
);

export default SaveGoal;
