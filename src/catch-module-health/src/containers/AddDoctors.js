import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

import { HEALTH_INSURANCE } from './HealthInsurance';

const Log = createLogger('add-doctors');

export const ADD_DOCTORS = gql`
  mutation AddDoctors($input: [DoctorInput!]!) {
    upsertDoctors(input: $input) {
      id
      name
      phoneNumber
      type
    }
  }
`;

export const updateCache = (cache, { data: { upsertDoctors } }) => {
  try {
    let insuranceQuery = cache.readQuery({
      query: HEALTH_INSURANCE,
    });

    const doctors = access(insuranceQuery, 'viewer.health.doctors');

    let newDoctors;

    if (!doctors) {
      newDoctors = upsertDoctors;
    } else {
      newDoctors = doctors.concat(upsertDoctors);
    }

    insuranceQuery.viewer.health.doctors = newDoctors;

    cache.writeQuery({
      query: HEALTH_INSURANCE,
      data: insuranceQuery,
    });
  } catch (e) {
    Log.error(e);
  }
};

const AddDoctors = ({ children, onCompleted, isTest }) => (
  <Mutation
    mutation={ADD_DOCTORS}
    onCompleted={onCompleted}
    update={isTest ? undefined : updateCache}
  >
    {(addDoctors, { loading, error }) => {
      if (loading) Log.debug('adding doctors');

      return children({ addDoctors, loading, error });
    }}
  </Mutation>
);

AddDoctors.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default AddDoctors;
