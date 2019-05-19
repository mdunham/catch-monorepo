import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('update-contact');

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: ID!, $contactDetails: ContactDetails!) {
    updateContact(id: $id, contactDetails: $contactDetails) {
      id
      givenName
      familyName
      relation
      phoneNumber
      email
      isTrustedContact
      isTaxDependent
    }
  }
`;

export const UpdateContact = ({ children, contactId, onCompleted }) => (
  <Mutation mutation={UPDATE_CONTACT} onCompleted={onCompleted} key={contactId}>
    {(updateContact, { loading, error }) => {
      if (loading) Log.debug('updating contact');

      return children({
        updateContact,
        loading,
        error,
      });
    }}
  </Mutation>
);

UpdateContact.propTypes = {
  children: PropTypes.func.isRequired,
  contactId: PropTypes.string.isRequired,
  onCompleted: PropTypes.func,
};

export default UpdateContact;
