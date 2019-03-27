import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { CONTACTS_QUERY } from './ContactsQuery';

const Log = createLogger('add-contact');

export const ADD_CONTACT = gql`
  mutation AddContact($contactDetails: ContactDetails!) {
    addContact(contactDetails: $contactDetails) {
      id
      givenName
      familyName
      relation
      phoneNumber
      email
      isTaxDependent
      isTrustedContact
    }
  }
`;

export const AddContact = ({ children, onCompleted }) => (
  <Mutation
    mutation={ADD_CONTACT}
    update={(cache, { data: { addContact } }) => {
      let _cache = cache.readQuery({ query: CONTACTS_QUERY });
      let contacts = _cache.viewer.contacts;

      contacts = contacts ? contacts.concat([addContact]) : [addContact];
      _cache.viewer.contacts = contacts;

      cache.writeQuery({
        query: CONTACTS_QUERY,
        data: _cache,
      });
    }}
    onCompleted={onCompleted}
  >
    {(addContact, { loading, error }) => {
      if (loading) Log.debug('creating new contact');

      return children({
        addContact,
        loading,
        error,
      });
    }}
  </Mutation>
);

AddContact.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default AddContact;
