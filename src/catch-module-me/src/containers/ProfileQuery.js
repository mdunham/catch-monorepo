import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const PROFILE_QUERY = gql`
  query ProfileQuery {
    viewer {
      user {
        id
        kycSavings {
          status
        }
      }
      savingsAccountMetadata {
        isAccountReady
      }
    }
  }
`;

export const ProfileQuery = ({ children }) => (
  <Query query={PROFILE_QUERY} fetchPolicy="network-only">
    {({ data, error, loading }) => {
      const kycStatus = access(data, 'viewer.user.kycSavings.status');

      const canRefer = kycStatus && kycStatus !== 'KYC_DENIED';

      // allow a user to add contacts to their profile if their BBVA account is ready
      const canHaveContacts = !!access(
        data,
        'viewer.savingsAccountMetadata.isAccountReady',
      );

      return children({ loading, error, canHaveContacts, canRefer });
    }}
  </Query>
);

ProfileQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ProfileQuery;
