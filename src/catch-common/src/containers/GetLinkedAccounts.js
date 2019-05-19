import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('get-linked-accounts');

export const GET_LINKED_ACCOUNTS = gql`
  query GetLinkedAccounts {
    viewer {
      bankLinks {
        id
        syncStatus
        dateAdded
        lastUpdated
        bank {
          id
          name
        }
        accounts {
          id
          balance
          nickname
          name
          isPrimary
          accountNumber
          bankLink {
            id
            syncStatus
            dateAdded
            lastUpdated
          }
        }
      }
      primaryAccount {
        id
        name
        nickname
        balance
        isPrimary
        accountNumber
        bankLink {
          id
          syncStatus
          dateAdded
          lastUpdated
        }
      }
    }
  }
`;

export const GetLinkedAccounts = ({ children }) => (
  <Query query={GET_LINKED_ACCOUNTS} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      Log.info(data);

      const bankLinks = access(data, 'viewer.bankLinks');
      const primaryAccount = access(data, 'viewer.primaryAccount');
      const activeBankLinks = bankLinks
        ? bankLinks.filter(bl => bl.accounts.length)
        : undefined;

      return children({
        error,
        loading,
        bankLinks,
        activeBankLinks,
        primaryAccount,
      });
    }}
  </Query>
);

GetLinkedAccounts.propTypes = {
  children: PropTypes.func.isRequired,
};

export default GetLinkedAccounts;
