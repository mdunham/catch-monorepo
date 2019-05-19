import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { Log } from '@catch/utils';

export const DELETE_HEALTH_INSURANCE = gql`
  mutation DeleteHealthInsurance {
    deleteHealthInsurance
  }
`;

const DeleteHealthInsurance = ({ children, onCompleted }) => (
  <Mutation mutation={DELETE_HEALTH_INSURANCE} onCompleted={onCompleted}>
    {(deleteHealthInsurance, { loading, error }) => {
      if (loading)
        Log.debug('deleting health insurance', 'delete-health-insurance');

      return children({ deleteHealthInsurance, loading, error });
    }}
  </Mutation>
);

DeleteHealthInsurance.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default DeleteHealthInsurance;
