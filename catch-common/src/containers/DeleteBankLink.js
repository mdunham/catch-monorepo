import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

import { GET_LINKED_ACCOUNTS } from './GetLinkedAccounts';

const Log = createLogger('delete-bank-link');

export const DELETE_BANK_LINK = gql`
  mutation DeleteBankLink($input: DeleteBankLinkRequest!) {
    deleteBankLink(input: $input)
  }
`;

export const DeleteBankLink = ({ children, onCompleted, onError, refetch }) => (
  <Mutation
    mutation={DELETE_BANK_LINK}
    onCompleted={onCompleted}
    onError={onError}
    refetchQueries={refetch && [{ query: GET_LINKED_ACCOUNTS }]}
  >
    {(deleteBankLink, { loading, error }) => {
      if (loading || error) return children({ loading, error });

      return children({ deleteBankLink });
    }}
  </Mutation>
);

DeleteBankLink.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  refetch: PropTypes.bool.isRequired,
};

DeleteBankLink.defaultProps = {
  refetch: false,
};

export default DeleteBankLink;
