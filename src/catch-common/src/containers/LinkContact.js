import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { CONTACTS_QUERY } from './ContactsQuery';

const Log = createLogger('link-contact');

export const LINK_CONTACT = gql`
  mutation LinkContact($id: ID!, $type: ContactType!) {
    linkContact(id: $id, type: $type) {
      id
      givenName
      familyName
      relation
      isTaxDependent
      isTrustedContact
    }
  }
`;

export const LinkContact = ({
  children,
  isChangingTaxDepStatus,
  onCompleted,
}) => (
  <Mutation
    mutation={LINK_CONTACT}
    onCompleted={onCompleted}
    update={(cache, { data: { linkContact } }) => {
      let _cache = cache.readQuery({ query: CONTACTS_QUERY });

      const shouldPushNewDependent =
        isChangingTaxDepStatus &&
        !!_cache.viewer.taxGoal &&
        (!!_cache.viewer.taxGoal.taxDependents
          ? !_cache.viewer.taxGoal.taxDependents.find(
              dep => dep.id === linkContact.id,
            )
          : !!linkContact.isTaxDependent);

      if (shouldPushNewDependent) {
        let taxDependents = _cache.viewer.taxGoal.taxDependents;

        let newDependent = {};
        newDependent.id = linkContact.id;
        newDependent.givenName = linkContact.givenName;
        newDependent.familyName = linkContact.familyName;
        newDependent.relation = linkContact.relation;
        newDependent.__typename = linkContact.__typename;

        taxDependents = Array.isArray(taxDependents)
          ? taxDependents.concat([newDependent])
          : [newDependent];

        _cache.viewer.taxGoal.taxDependents = taxDependents;
      }

      cache.writeQuery({
        query: CONTACTS_QUERY,
        data: _cache,
      });
    }}
  >
    {(linkContact, { loading, error }) => {
      if (loading) Log.debug('linking contact');

      return children({ linkContact, loading, error });
    }}
  </Mutation>
);

LinkContact.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default LinkContact;
