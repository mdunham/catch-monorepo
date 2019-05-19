import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('upsert-doctor');

// UPSERT is a sufficient name because this mutation can both create and/or update a doctor

export const UPSERT_DOCTOR = gql`
  mutation UpsertDoctor($input: DoctorInput!) {
    upsertDoctor(input: $input) {
      id
      phoneNumber
      name
      type
    }
  }
`;

const UpsertDoctor = ({ children, onCompleted }) => (
  <Mutation mutation={UPSERT_DOCTOR} onCompleted={onCompleted}>
    {(upsertDoctor, { loading, error }) => {
      if (loading) Log.debug('upserting doctor');

      return children({ upsertDoctor, loading, error });
    }}
  </Mutation>
);

export default UpsertDoctor;
