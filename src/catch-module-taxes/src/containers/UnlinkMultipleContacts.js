import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('unlink-multiple-contacts');

export const UNLINK_CONTACTS = gql`
  mutation UnlinkContacts($ids: [ID!]!, $type: ContactType!) {
    unlinkContacts(ids: $ids, type: $type) {
      id
      isTaxDependent
    }
  }
`;

const UnlinkMultipleContacts = ({ children, onCompleted }) => (
  <Mutation mutation={UNLINK_CONTACTS} onCompleted={onCompleted}>
    {(unlinkContacts, { error, loading, data }) => {
      if (data) Log.info(data);

      return children({
        unlinkContacts,
        loading,
        error,
      });
    }}
  </Mutation>
);

UnlinkMultipleContacts.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UnlinkMultipleContacts;
