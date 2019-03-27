import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { CONTACTS_QUERY } from './ContactsQuery';

const Log = createLogger('unlink-contact');

export const UNLINK_CONTACT = gql`
  mutation UnlinkContact($id: ID!, $type: ContactType!) {
    unlinkContact(id: $id, type: $type) {
      id
      isTaxDependent
      isTrustedContact
    }
  }
`;

export const UnlinkContact = ({ children, onCompleted }) => (
  <Mutation
    mutation={UNLINK_CONTACT}
    onCompleted={onCompleted}
    update={(cache, { data: { unlinkContact } }) => {
      let _cache = cache.readQuery({ query: CONTACTS_QUERY });

      if (!!_cache.viewer.taxGoal && !unlinkContact.isTaxDependent) {
        let taxDependents = _cache.viewer.taxGoal.taxDependents;

        _cache.viewer.taxGoal.taxDependents = taxDependents.filter(
          dep => dep.id !== unlinkContact.id,
        );
      }

      cache.writeQuery({
        query: CONTACTS_QUERY,
        data: _cache,
      });
    }}
  >
    {(unlinkContact, { loading, error }) => {
      if (loading) Log.debug('unlinking contact');

      return children({ unlinkContact, loading, error });
    }}
  </Mutation>
);

UnlinkContact.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UnlinkContact;
