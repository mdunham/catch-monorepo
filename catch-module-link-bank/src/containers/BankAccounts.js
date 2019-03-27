import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

export const BANK_ACCOUNTS = gql`
  query Accounts($id: ID!) {
    viewer {
      primaryAccount {
        id
      }
      bankLink(id: $id) {
        accounts {
          accountNumber
          balance
          name
          id
          nickname
        }
      }
    }
  }
`;

const BankAccounts = ({ bankLinkId, children }) => (
  <Query query={BANK_ACCOUNTS} variables={{ id: bankLinkId }}>
    {({ loading, error, data, refetch }) => {
      return children({
        loading,
        error,
        accounts: access(data, 'viewer.bankLink.accounts') || [],
        primaryAccountId: access(data, 'viewer.primaryAccount.id'),
        refetch,
      });
    }}
  </Query>
);

export default BankAccounts;
