import React from 'react';
import { func } from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('update-ssn');

export const UPDATE_SSN = gql`
  mutation UpdateSSN($input: UpdateSSNInput!) {
    updateSSN(input: $input) {
      ssn
    }
  }
`;

export const UpdateSSN = ({ children, onCompleted }) => (
  <Mutation mutation={UPDATE_SSN} onCompleted={onCompleted}>
    {(updateSSN, { loading, error }) => {
      if (loading) Log.debug('setting ssn');
      return children({ updateSSN, loading, error });
    }}
  </Mutation>
);

UpdateSSN.propTypes = {
  children: func.isRequired,
  onCompleted: func,
};

export default UpdateSSN;
