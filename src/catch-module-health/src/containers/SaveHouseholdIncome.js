import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-household-income');

export const SAVE_HOUSEHOLD_INCOME = gql`
  mutation SaveHouseholdIncome($input: HealthInformationInput!) {
    upsertHealthInformation(input: $input) {
      totalHouseholdIncome
    }
  }
`;

const SaveHouseholdIncome = ({ children, onCompleted }) => (
  <Mutation mutation={SAVE_HOUSEHOLD_INCOME} onCompleted={onCompleted}>
    {(saveHouseholdIncome, { loading, error, data }) => {
      if (loading) Log.debug('Saving household income');

      return children({
        loading,
        saveHouseholdIncome,
      });
    }}
  </Mutation>
);

export default SaveHouseholdIncome;
