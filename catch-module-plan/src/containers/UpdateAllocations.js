import React from 'react';
import { func } from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

import { PLAN_STATUS } from './PlanStatus';

const Log = createLogger('update-allocations');

export const UPDATE_ALLOCATIONS = gql`
  mutation UpdateAllocations(
    $ptoGoalInput: PTOGoalInput!
    $retirementGoalInput: RetirementGoalInput!
    $taxGoalInput: TaxGoalInput!
  ) {
    upsertPTOGoal(input: $ptoGoalInput) {
      id
      paycheckPercentage
      status
      plannedTarget
      unplannedTarget
    }
    upsertRetirementGoal(input: $retirementGoalInput) {
      id
      paycheckPercentage
      status
    }
    upsertTaxGoal(input: $taxGoalInput) {
      id
      estimatedPaycheckPercentage
      paycheckPercentage
      status
    }
  }
`;

const UpdateAllocations = ({ afterComplete, children }) => (
  <Mutation
    mutation={UPDATE_ALLOCATIONS}
    refetchQueries={[{ query: PLAN_STATUS }]}
    onCompleted={() => afterComplete()}
  >
    {(updateAllocations, { loading, error }) => {
      if (loading) Log.debug('Updating plan allocations');
      return children({ updateAllocations });
    }}
  </Mutation>
);

UpdateAllocations.propTypes = {
  afterComplete: func.isRequired,
  children: func.isRequired,
};

export default UpdateAllocations;
