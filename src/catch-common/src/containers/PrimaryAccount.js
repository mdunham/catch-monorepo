import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const PRIMARY_ACCOUNT = gql`
  query PrimaryAccount {
    viewer {
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
          bank {
            id
            name
          }
        }
      }
      bankLinks {
        id
      }
    }
  }
`;

export const PrimaryAccount = ({ children }) => (
  <Query query={PRIMARY_ACCOUNT} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      const primaryAccount = access(data, 'viewer.primaryAccount');
      const syncStatus = access(
        data,
        'viewer.primaryAccount.bankLink.syncStatus',
      );
      const bank = access(data, 'viewer.primaryAccount.bankLink.bank');
      const bankLinkID = access(data, 'viewer.primaryAccount.bankLink.id');

      const bankName = access(data, 'viewer.primaryAccount.bankLink.bank.name');
      const lastUpdated = access(
        data,
        'viewer.primaryAccount.bankLink.lastUpdated',
      );

      const bankLinks = access(data, 'viewer.bankLinks');
      const hasBankLinks = !!bankLinks;

      const balance = access(data, 'viewer.primaryAccount.balance');
      const primaryAccountName = access(data, 'viewer.primaryAccount.name');
      const primaryAccountNumber = access(
        data,
        'viewer.primaryAccount.accountNumber',
      );

      return children({
        loading,
        error,
        primaryAccount,
        syncStatus,
        bankName,
        bank,
        bankLinkID,
        lastUpdated,
        hasBankLinks,
        balance,
        primaryAccountName,
        primaryAccountNumber,
      });
    }}
  </Query>
);

PrimaryAccount.propTypes = {
  children: PropTypes.func.isRequired,
};

export default PrimaryAccount;
