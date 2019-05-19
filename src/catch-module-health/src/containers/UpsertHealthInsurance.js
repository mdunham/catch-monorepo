import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('upsert-health-insurance');

export const UPSERT_HEALTH_INSURANCE = gql`
  mutation UpsertHealthInsurance($input: HealthInsuranceInput!) {
    upsertHealthInsurance(input: $input) {
      id
      carrier
      planName
      insuranceSource
      policyNumber
      phoneNumber
      notes
    }
  }
`;

const UpsertHealthInsurance = ({ children, onCompleted }) => (
  <Mutation mutation={UPSERT_HEALTH_INSURANCE} onCompleted={onCompleted}>
    {(upsertHealthInsurance, { loading, error }) => {
      if (loading) Log.debug('upserting health insurance');

      return children({ upsertHealthInsurance, loading, error });
    }}
  </Mutation>
);

UpsertHealthInsurance.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UpsertHealthInsurance;
