import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-dependents');

export const SAVE_HEALTH_DEPENDENTS = gql`
  mutation SaveHealthDependents($input: [HealthDependentInput!]!) {
    replaceHealthDependents(input: $input) {
      id
      age
      relation
      isSmoker
      isPregnant
      isParent
    }
  }
`;

const SaveHealthDependents = ({ children, onCompleted }) => (
  <Mutation mutation={SAVE_HEALTH_DEPENDENTS} onCompleted={onCompleted}>
    {(saveHealthDependents, { loading, error, data }) => {
      if (loading) Log.debug('Saving health dependents');

      return children({
        loading,
        saveHealthDependents,
      });
    }}
  </Mutation>
);

export default SaveHealthDependents;
