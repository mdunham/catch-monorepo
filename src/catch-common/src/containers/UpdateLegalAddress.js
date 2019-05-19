import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

import { USER_INFO } from './UserInfo';

const Log = createLogger('update-legal-address');

export const UPDATE_LEGAL_ADDRESS = gql`
  mutation UpdateLegalAddress($input: AddressInput!) {
    updateLegalAddress(input: $input) {
      street1
      street2
      city
      state
      zip
      country
    }
  }
`;

export const UpdateLegalAddress = ({ children, onCompleted }) => (
  <Mutation
    mutation={UPDATE_LEGAL_ADDRESS}
    onCompleted={onCompleted}
    refetchQueries={[{ query: USER_INFO }]}
  >
    {(updateLegalAddress, { loading, error }) => {
      if (loading) Log.debug('updating legal address');

      return children({ updateLegalAddress, loading });
    }}
  </Mutation>
);

UpdateLegalAddress.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UpdateLegalAddress;
