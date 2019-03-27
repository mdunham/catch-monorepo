import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('household-income');

export const HOUSEHOLD_INCOME = gql`
  query HouseholdIncome {
    viewer {
      user {
        id
        workType
        filingStatus
      }
      income {
        estimated1099Income
        estimatedW2Income
      }
      spouseIncome
      health {
        information {
          totalHouseholdIncome
        }
        dependents {
          id
          relation
        }
      }
    }
  }
`;

const HouseholdIncome = ({ children }) => (
  <Query query={HOUSEHOLD_INCOME} fetchPolicy="network-only">
    {({ loading, data }) => {
      const get = access(data);
      const workType = get('viewer.user.workType');
      const filingStatus = get('viewer.user.filingStatus');
      const estimatedW2Income = get('viewer.income.estimatedW2Income');
      const estimated1099Income = get('viewer.income.estimated1099Income');
      const spouseIncome = get('viewer.spouseIncome');
      const dependents = get('viewer.health.dependents') || [];
      const hasSpouseDependent = dependents.some(
        dep => dep.relation === 'SPOUSE',
      );
      const savedHouseholdIncome = get(
        'viewer.health.information.totalHouseholdIncome',
      );
      /**
       * The household income includes the spouse income if:
       * 1) The user files as married or included their spouse in their health dependents
       * 2) We have a value for it
       */
      const includeSpouseIncome =
        (hasSpouseDependent || filingStatus === 'MARRIED') && spouseIncome > 0;

      const incomes = {
        WORK_TYPE_1099: estimated1099Income,
        WORK_TYPE_W2: estimatedW2Income,
        WORK_TYPE_DIVERSIFIED: estimatedW2Income + estimated1099Income,
      };
      const householdIncome = includeSpouseIncome
        ? incomes[workType] + spouseIncome
        : incomes[workType];

      Log.debug(householdIncome);

      return children({
        loading,
        householdIncome: savedHouseholdIncome || householdIncome,
      });
    }}
  </Query>
);

export default HouseholdIncome;
