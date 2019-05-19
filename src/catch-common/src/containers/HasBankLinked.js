import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

export const BANK_LINKS = gql`
  query HasBankLinked {
    viewer {
      bankLinks {
        id
      }
      primaryAccount {
        id
        bankLink {
          id
          syncStatus
        }
      }
    }
  }
`;

const HasBankLinked = ({ children }) => (
  <Query query={BANK_LINKS} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      const bankLinks = access(data, 'viewer.bankLinks');
      const primaryAccount = access(data, 'viewer.primaryAccount');

      const hasBankLinked = !!bankLinks && bankLinks.length > 0;
      const hasPrimaryAccount = !!primaryAccount;

      const validSyncStatuses = ['GOOD', 'SYNCING'];
      const hasValidSync =
        hasPrimaryAccount &&
        validSyncStatuses.includes(primaryAccount.bankLink.syncStatus);

      return children({ loading, error, hasBankLinked, hasValidSync });
    }}
  </Query>
);

HasBankLinked.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HasBankLinked;
