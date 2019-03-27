import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('health-plan-selection');

export const HEALTH_PLAN_SELECTION = gql`
  query HealthPlanSelection {
    viewer {
      health {
        householdEligibilityEstimate {
          dependentID
          advancePremiumTaxCredit
          costSharingReductions
        }
        information {
          providerPlan {
            id
            name
            type
            deductibles {
              amount
              familyCost
            }
            premium
            issuer {
              name
            }
            metalLevel
            moops {
              amount
              familyCost
            }
          }
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

const HealthPlanSelection = ({ children }) => (
  <Query query={HEALTH_PLAN_SELECTION} fetchPolicy="network-only">
    {({ loading, data }) => {
      const get = access(data);
      const dependents = get('viewer.health.dependents') || [];
      const monthlySavings =
        get(
          'viewer.health.householdEligibilityEstimate[0].advancePremiumTaxCredit',
        ) || 0;
      const planID = get('viewer.health.information.providerPlan.id');
      const planName = get('viewer.health.information.providerPlan.name');
      const provider = get(
        'viewer.health.information.providerPlan.issuer.name',
      );
      const planType = get('viewer.health.information.providerPlan.type');
      const metalLevel = get(
        'viewer.health.information.providerPlan.metalLevel',
      );
      const monthlyPremium =
        get('viewer.health.information.providerPlan.premium') || 0;
      const yearlyDeduct =
        get(
          'viewer.health.information.providerPlan.deductibles.find().amount',
          [
            ded =>
              ded.familyCost === 'Family Per Person' ||
              ded.familyCost === 'Individual',
          ],
        ) ||
        get(
          'viewer.health.information.providerPlan.deductibles.find().amount',
          [ded => ded.familyCost === 'Family'],
        );
      const yearlyMoop =
        get('viewer.health.information.providerPlan.moops.find().amount', [
          moop =>
            moop.familyCost === 'Family Per Person' ||
            moop.familyCost === 'Individual',
        ]) ||
        get('viewer.health.information.providerPlan.moops.find().amount', [
          moop => moop.familyCost === 'Family',
        ]);

      return children({
        monthlyPremium:
          monthlyPremium - monthlySavings < 0
            ? 0
            : monthlyPremium - monthlySavings,
        monthlySavings,
        yearlyDeduct,
        dependents,
        yearlyMoop,
        metalLevel,
        planName,
        provider,
        planType,
        loading,
        planID,
      });
    }}
  </Query>
);

export default HealthPlanSelection;
