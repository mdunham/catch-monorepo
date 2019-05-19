import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

import { GET_LINKED_ACCOUNTS } from './GetLinkedAccounts';

const Log = createLogger('set-primary-account');

export const SET_PRIMARY_ACCOUNT = gql`
  mutation SetPrimaryAccount($input: SetPrimaryAccountInput!) {
    setPrimaryAccount(input: $input) {
      id
      isPrimary
      balance
      nickname
      name
      accountNumber
      bankLink {
        id
        syncStatus
        dateAdded
        lastUpdated
      }
    }
  }
`;

export const SetPrimaryAccount = ({
  children,
  onCompleted,
  onError,
  refetch,
}) => (
  <Mutation
    mutation={SET_PRIMARY_ACCOUNT}
    onCompleted={onCompleted}
    onError={onError}
    refetchQueries={refetch ? [{ query: GET_LINKED_ACCOUNTS }] : undefined}
    update={(cache, { data: { setPrimaryAccount } }) => {
      const data = cache.readQuery({ query: GET_LINKED_ACCOUNTS });
      const { primaryAccount, bankLinks } = data.viewer;

      setPrimaryAccount.isPrimary = true;

      const prevPrimaryAccount = primaryAccount;

      // set prev primary account isPrimary to false
      prevPrimaryAccount.isPrimary = false;

      // find prev primary bankLink in bankLinks array
      const prevPrimaryBankLink = prevPrimaryAccount.bankLink;
      const prevPrimaryBankLinkIndex = bankLinks.indexOf(
        bankLinks.find(bl => bl.id === prevPrimaryBankLink.id),
      );

      // find index of account in accounts array from bankLink in bankLinks array ^
      const prevPrimaryAccountIndex = bankLinks[
        prevPrimaryBankLinkIndex
      ].accounts.indexOf(
        bankLinks[prevPrimaryBankLinkIndex].accounts.find(
          acc => acc.id === prevPrimaryAccount.id,
        ),
      );

      // overwrite newPrimary bankLink in bankLinks array
      const bankLink = bankLinks.find(
        bl => bl.id === setPrimaryAccount.bankLink.id,
      );

      const indexOfBankLink = data.viewer.bankLinks.indexOf(bankLink);

      const accountToSetPrimary = bankLink.accounts.find(
        acc => acc.id === setPrimaryAccount.id,
      );

      // set old primary account in bankLinks array to false
      data.viewer.bankLinks[prevPrimaryBankLinkIndex].accounts[
        prevPrimaryAccountIndex
      ] = prevPrimaryAccount;

      // set new primary account in bankLink in bankLinks array to new primary account
      data.viewer.bankLinks[indexOfBankLink].accounts[
        bankLink.accounts.indexOf(accountToSetPrimary)
      ] = setPrimaryAccount;

      // overwrite primary account in cache
      data.viewer.primaryAccount = setPrimaryAccount;

      // rewrite linked accounts main fetch query directly to cache
      cache.writeQuery({ query: GET_LINKED_ACCOUNTS, data });
    }}
  >
    {(setPrimaryAccount, { loading, error }) => {
      if (loading) Log.debug('setting primary account');

      return children({ loading, setPrimaryAccount });
    }}
  </Mutation>
);

SetPrimaryAccount.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  refetch: PropTypes.bool.isRequired,
  update: PropTypes.func,
};

SetPrimaryAccount.defaultProps = {
  refetch: false,
};

export default SetPrimaryAccount;
