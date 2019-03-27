import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('delete-doctor');

export const DELETE_DOCTOR = gql`
  mutation DeleteDoctor($id: ID!) {
    deleteDoctor(id: $id) {
      id
    }
  }
`;

const DeleteDoctor = ({ children, onCompleted }) => (
  <Mutation mutation={DELETE_DOCTOR} onCompleted={onCompleted}>
    {(deleteDoctor, { loading, error }) => {
      if (loading) Log.debug('deleting doctor');

      return children({ deleteDoctor, loading });
    }}
  </Mutation>
);

DeleteDoctor.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default DeleteDoctor;
