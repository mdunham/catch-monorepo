import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { CONTACTS_QUERY } from './ContactsQuery';

const Log = createLogger('delete-contact');

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: ID!) {
    deleteContact(id: $id) {
      id
      givenName
      familyName
      relation
      email
      phoneNumber
      isTaxDependent
      isTrustedContact
    }
  }
`;

export const DeleteContact = ({ children, isTaxDependent, onCompleted }) => (
  <Mutation
    mutation={DELETE_CONTACT}
    update={(cache, { data: { deleteContact } }) => {
      let readQuery = cache.readQuery({ query: CONTACTS_QUERY });

      const ctx = readQuery.viewer.contacts.filter(
        ct => ct.id !== deleteContact.id,
      );

      readQuery.viewer.contacts = ctx;

      if (isTaxDependent) {
        const txDependents = readQuery.viewer.taxGoal.taxDependents.filter(
          dep => dep.id !== deleteContact.id,
        );

        readQuery.viewer.taxGoal.taxDependents = txDependents;
      }

      cache.writeQuery({
        query: CONTACTS_QUERY,
        data: readQuery,
      });
    }}
    onCompleted={onCompleted}
  >
    {(deleteContact, { loading, error }) => {
      if (loading) Log.debug('deleting contact');

      return children({
        deleteContact,
        loading,
        error,
      });
    }}
  </Mutation>
);

DeleteContact.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

export default DeleteContact;
