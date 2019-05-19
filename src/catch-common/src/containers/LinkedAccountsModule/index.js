import React from 'react';
import Component from './Component';
import gql from 'graphql-tag';
import { withApollo, compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';

import { actions } from './duck';

// --------
// Read bankLinks and accounts from db
// --------
const ACCOUNTS = gql`
  query LinkedAccounts {
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
          bank {
            name
          }
        }
      }
    }
  }
`;

const withInitialValues = graphql(ACCOUNTS, {
  props: ({ ownProps, data: { loading, error, ...rest } }) => ({
    initialValuesLoading: loading,
    initialValuesError: error,
    ...rest,
    ...ownProps,
  }),
});

// --------
// DELETE A BANK LINK
// --------
const DELETE_BANK_LINK = gql`
  mutation DeleteBankLink($input: DeleteBankLinkRequest!) {
    deleteBankLink(input: $input)
  }
`;

const withBankLinkDeletion = graphql(DELETE_BANK_LINK, {
  props: ({ ownProps, mutate }) => ({
    deleteBankLink: id =>
      mutate({
        variables: { input: { id } },
        optimisticResponse: {
          deleteBankLink: {
            id,
          },
        },
      }),
  }),
  // @TODO: discuss with design on more verbose delete confirmation experience
  options: {
    refetchQueries: [{ query: ACCOUNTS }],
  },
});

// --------
// Sets the primary account
// --------
const SET_PRIMARY_ACCOUNT = gql`
  mutation SetPrimaryAccount($input: SetPrimaryAccountInput!) {
    setPrimaryAccount(input: $input) {
      id
      isPrimary
    }
  }
`;

const withSetPrimaryAccount = graphql(SET_PRIMARY_ACCOUNT, {
  props: ({ ownProps, mutate }) => ({
    setPrimaryAccount: ({ id, value }) =>
      mutate({
        variables: { input: { accountId: id, isPrimary: value } },
      }),
  }),
  options: {
    //@TODO: replace with optimistic response
    refetchQueries: [{ query: ACCOUNTS }],
  },
});

const withRedux = connect(undefined, actions);
const enhance = compose(
  withRedux,
  withApollo,
  withInitialValues,
  withBankLinkDeletion,
  withSetPrimaryAccount,
);

export default enhance(Component);
