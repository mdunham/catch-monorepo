import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { TAX_QUERY } from './CalculateTaxes';

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

const Log = createLogger('UpdateTaxGoal');

export const UpdateTaxGoal = ({ onCompleted, children }) => {
  return (
    <Mutation
      mutation={UPSERT_TAX_GOAL}
      onCompleted={onCompleted}
      refetchQueries={[{ query: TAX_QUERY }]}
    >
      {(upsertTaxGoal, { loading, error }) => {
        if (loading) Log.debug('updating tax goal');
        return children({ upsertTaxGoal, saving: loading });
      }}
    </Mutation>
  );
};

export default UpdateTaxGoal;
