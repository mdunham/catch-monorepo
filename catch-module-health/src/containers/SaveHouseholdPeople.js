import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-household-people');

export const SAVE_HOUSEHOLD_PEOPLE = gql`
  mutation SaveHouseholdPeople($input: HealthInformationInput!) {
    upsertHealthInformation(input: $input) {
      totalPeopleHousehold
    }
  }
`;

const SaveHouseholdPeople = ({ children, onCompleted }) => (
  <Mutation mutation={SAVE_HOUSEHOLD_PEOPLE} onCompleted={onCompleted}>
    {(saveHouseholdPeople, { loading, error, data }) => {
      if (loading) Log.debug('Saving household people number');

      return children({
        loading,
        saveHouseholdPeople,
      });
    }}
  </Mutation>
);

export default SaveHouseholdPeople;
