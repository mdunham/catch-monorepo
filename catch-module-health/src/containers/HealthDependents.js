import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger, convertUnixTimeToAge } from '@catch/utils';

const Log = createLogger('dependents-query');

export const HEALTH_DEPENDENTS = gql`
  query HealthDependents {
    viewer {
      user {
        id
        dob
      }
      health {
        dependents {
          id
          age
          relation
          isSmoker
          isPregnant
          isParent
        }
      }
    }
  }
`;

const HealthDependents = ({ children }) => (
  <Query query={HEALTH_DEPENDENTS} fetchPolicy="network-only">
    {({ loading, data }) => {
      const dob = access(data, 'viewer.user.dob');
      // Remove _typename from default form fields
      const dependents = (access(data, 'viewer.health.dependents') || []).map(
        dep => ({
          age: dep.age,
          relation: dep.relation,
          isSmoker: dep.isSmoker,
          isPregnant: dep.isPregnant,
          isParent: dep.isParent,
        }),
      );

      const age = convertUnixTimeToAge(dob);

      return children({
        loading,
        dependents,
        age,
      });
    }}
  </Query>
);

export default HealthDependents;
