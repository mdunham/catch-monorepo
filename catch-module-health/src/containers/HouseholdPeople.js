import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('household-people');

export const HOUSEHOLD_PEOPLE = gql`
  query HouseholdPeople {
    viewer {
      user {
        id
        filingStatus
      }
      taxGoal {
        id
        numDependents
      }
      health {
        information {
          totalPeopleHousehold
        }
        dependents {
          id
          age
          relation
        }
      }
    }
  }
`;

const HouseholdPeople = ({ children }) => (
  <Query query={HOUSEHOLD_PEOPLE} fetchPolicy="network-only">
    {({ loading, data }) => {
      // Saved value from tax plan
      const filingStatus = access(data, 'viewer.user.filingStatus');
      const hasSpouse = filingStatus === 'MARRIED';
      const taxDependentsNum = access(data, 'viewer.taxGoal.numDependents');
      const taxHouseholdNum = taxDependentsNum
        ? hasSpouse
          ? taxDependentsNum + 2
          : taxDependentsNum + 1
        : null;

      // Saved value from previous health step
      const householdDependents =
        access(data, 'viewer.health.dependents') || [];

      const depsNum = householdDependents.length;

      // Saved value from previous session
      const totalPeopleHousehold = access(
        data,
        'viewer.health.information.totalPeopleHousehold',
      );

      /**
       * The value can either be one we saved already, or the number of tax dependents
       * or the number of saved dependents under 19 + the user and their spouse if applicable
       */
      const peopleHouseholdNum =
        totalPeopleHousehold || taxHouseholdNum || depsNum;

      return children({
        loading,
        peopleHouseholdNum,
      });
    }}
  </Query>
);

export default HouseholdPeople;
