import gql from 'graphql-tag';

export const TAX_QUERY = gql`
  query TaxGoal {
    viewer {
      incomeState
      income {
        estimatedW2Income
        estimated1099Income
      }
      spouseIncome
      user {
        id
        filingStatus
        workType
      }
      taxGoal {
        id
        numDependents
        numExemptions
        taxDeferredContributions
        estimatedJobExpenseRange
        paycheckPercentage
        status
        availableBalance
      }
      savingsAccountMetadata {
        isAccountReady
        isAccountLocked
      }
    }
  }
`;

export const UPSERT_TAX_GOAL = gql`
  mutation SaveTaxGoal($input: TaxGoalInput!) {
    upsertTaxGoal(input: $input) {
      id
      filingStatus
      spouseIncome
      numDependents
      numExemptions
      taxDeferredContributions
      estimatedJobExpenseRange
      paycheckPercentage
      status
      isAccountReady
    }
  }
`;
