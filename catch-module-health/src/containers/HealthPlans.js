import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';
import { filterPlans } from '../utils';

const Log = createLogger('health-plans');

export const HEALTH_PLANS = gql`
  query HealthPlans {
    viewer {
      health {
        householdEligibilityEstimate {
          dependentID
          advancePremiumTaxCredit
          isMedicaidCHIP
          costSharingReductions
        }
        plans {
          plans {
            id
            name
            deductibles {
              amount
              familyCost
            }
            issuer {
              name
            }
            metalLevel
            moops {
              amount
              familyCost
            }
            premium
            type
          }
          total
        }
      }
    }
  }
`;

class HealthPlans extends React.PureComponent {
  render() {
    const {
      children,
      filters,
      activeFilters,
      showFilter,
      onCompleted,
    } = this.props;
    return (
      <Query
        query={HEALTH_PLANS}
        fetchPolicy="network-only"
        onCompleted={onCompleted}
      >
        {({ loading, data }) => {
          const get = access(data);
          const total = get('viewer.health.plans.total');
          const monthlySavings =
            get(
              'viewer.health.householdEligibilityEstimate[0].advancePremiumTaxCredit',
            ) || 0;
          const hasCSR = !!get(
            'viewer.health.householdEligibilityEstimate[0].costSharingReductions',
          );
          Log.debug(data);
          const plans =
            get('viewer.health.plans.plans.map()', [
              (item, i) => ({
                id: item.id,
                type: item.type,
                planName: item.name,
                premium: Math.round(
                  item.premium - monthlySavings < 0
                    ? 0
                    : item.premium - monthlySavings,
                ),
                provider: item.issuer.name,
                metalLevel: item.metalLevel,
                // If we really can't find individual costs we find the Family
                outOfPocket:
                  typeof get(
                    `viewer.health.plans.plans[${i}].moops.find().amount`,
                    [
                      moop =>
                        moop.familyCost === 'Family Per Person' ||
                        moop.familyCost === 'Individual',
                    ],
                  ) !== 'undefined'
                    ? get(
                        `viewer.health.plans.plans[${i}].moops.find().amount`,
                        [
                          moop =>
                            moop.familyCost === 'Family Per Person' ||
                            moop.familyCost === 'Individual',
                        ],
                      )
                    : get(
                        `viewer.health.plans.plans[${i}].moops.find().amount`,
                        [moop => moop.familyCost === 'Family'],
                      ),
                deductible:
                  typeof get(
                    `viewer.health.plans.plans[${i}].deductibles.find().amount`,
                    [
                      ded =>
                        ded.familyCost === 'Family Per Person' ||
                        ded.familyCost === 'Individual',
                    ],
                  ) !== 'undefined'
                    ? get(
                        `viewer.health.plans.plans[${i}].deductibles.find().amount`,
                        [
                          ded =>
                            ded.familyCost === 'Family Per Person' ||
                            ded.familyCost === 'Individual',
                        ],
                      )
                    : get(
                        `viewer.health.plans.plans[${i}].deductibles.find().amount`,
                        [ded => ded.familyCost === 'Family'],
                      ),
              }),
            ]) || [];

          const { filteredPlans, filteredLength } = filterPlans(
            plans,
            activeFilters,
            filters,
          );

          return children({
            total: activeFilters.length ? filteredLength : total,
            monthlySavings,
            filteredPlans,
            hasCSR,
            loading,
            plans,
          });
        }}
      </Query>
    );
  }
}

export default HealthPlans;
