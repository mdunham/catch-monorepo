import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

const Log = createLogger('check-kyc');

export const CHECK_KYC = gql`
  mutation CheckKYC {
    kycCheck {
      status
      needed
    }
  }
`;

export const CheckKYC = ({ children, onCompleted }) => (
  <Mutation mutation={CHECK_KYC} onCompleted={onCompleted}>
    {(checkKYC, { loading, error }) => {
      if (loading) Log.debug('checking KYC');

      return children({ checkKYC, loading });
    }}
  </Mutation>
);

CheckKYC.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default CheckKYC;
