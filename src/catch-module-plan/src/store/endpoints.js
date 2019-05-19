import { client } from '@catch/apollo';

import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const ACTIVE_GOALS = gql`
  query ActiveGoals {
    viewer {
      user {
        id
        kycSavings {
          status
        }
      }
      taxGoal {
        id
        estimatedPaycheckPercentage
        paycheckPercentage
        status
        availableBalance
      }
      retirementGoal {
        id
        paycheckPercentage
        status
        availableBalance
      }
      ptoGoal {
        id
        paycheckPercentage
        numDaysSaved
        plannedTarget
        unplannedTarget
        availableBalance
      }
      savingsGoals {
        id
        name
        paycheckPercentage
        status
      }
    }
  }
`;

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

export const SUGGESTIONS = gql`
  mutation SetRecommendationVisibility(
    $goalType: GoalType!
    $hidden: Boolean!
  ) {
    setRecommendationVisibility(goalType: $goalType, hidden: $hidden) {
      hiddenRecommendations
    }
  }
`;

export const BULK_WITHDRAW = gql`
  mutation BulkWithdrawFunds($input: [WithdrawGoalInput!]!) {
    withdrawGoals(input: $input)
  }
`;

export function activeGoals() {
  return client.query({ query: ACTIVE_GOALS });
}

export function setRecommendationVisibility(payload) {
  return client.mutate({
    mutation: SUGGESTIONS,
    variables: payload,
    fetchPolicy: 'no-cache',
  });
}
