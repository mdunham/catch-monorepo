import React from 'react';
import { bool, func } from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { createLogger } from '@catch/utils';

const Log = createLogger('upsert-retirement-goal');

export const UPSERT_RETIREMENT_GOAL = gql`
  mutation UpsertRetirementGoal($input: RetirementGoalInput!) {
    upsertRetirementGoal(input: $input) {
      id
      status
      paycheckPercentage
      externalSavings
      riskLevel
      riskComfort
      accountType
      portfolio {
        id
        name
      }
    }
  }
`;

export const UpsertRetirementGoal = ({
  children,
  onCompleted,
  refetch,
  variables,
  type,
  editPercentage,
}) => (
  <Mutation mutation={UPSERT_RETIREMENT_GOAL} onCompleted={onCompleted}>
    {(mutate, { loading, error }) => {
      if (loading) Log.debug('updating retirement goal');

      return children({
        onUpsert: ({ formValues, status }) =>
          mutate({
            variables: {
              input:
                type === 'CREATING'
                  ? { ...formValues, status }
                  : { paycheckPercentage: editPercentage },
            },
          }),
        updating: loading,
      });
    }}
  </Mutation>
);

UpsertRetirementGoal.propTypes = {
  children: func.isRequired,
  onCompleted: func,
  refetch: bool,
};

export default UpsertRetirementGoal;
