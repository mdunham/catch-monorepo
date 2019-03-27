/**
 * KycStatus
 *
 * Use this container to retrieve a user's kyc status
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const KYC_STATUS = gql`
  query KycStatus {
    viewer {
      user {
        kycSavings {
          status
          needed
        }
      }
    }
  }
`;

// the conditions under which a user is allowed to update their ssn
export const UPDATE_CONDITIONS = ['KYC_MISMATCH', 'KYC_SSN'];

const KycStatus = ({ children }) => (
  <Query query={KYC_STATUS} fetchPolicy="network-only">
    {({ data, loading, error }) => {
      const status = access(data, 'viewer.user.kycSavings.status');
      const needed = access(data, 'viewer.user.kycSavings.needed');

      // Some users may need to update SSN due to typo or other errors
      const canUpdateSSN =
        status === 'KYC_REVIEW' &&
        Array.isArray(needed) &&
        UPDATE_CONDITIONS.some(cond => needed.includes(cond));

      return children({ status, needed, canUpdateSSN, loading, error });
    }}
  </Query>
);

KycStatus.propTypes = {
  children: PropTypes.func.isRequired,
};

export default KycStatus;
