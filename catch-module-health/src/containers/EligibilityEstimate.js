import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('eligibility-estimate-query');

export const ELIGIBILITY_ESTIMATE = gql`
  query HealthDependents {
    viewer {
      health {
        dependents {
          id
          age
          relation
          isSmoker
          isPregnant
          isParent
        }
        householdEligibilityEstimate {
          dependentID
          advancePremiumTaxCredit
          isMedicaidCHIP
          costSharingReductions
        }
      }
    }
  }
`;

/**
 * The child is CHIP IF their parent is not Medicaid.
 * If the parent is Medicaid then the children are Medicaid as well.
 * @enum { string } medicaidStatus
 * SELF
 * SELF_AND_SPOUSE
 * FAMILY
 * CHILD
 * CHILDREN
 */
export function getMedicaidStatus(dependents, results) {
  let numChildren = 0;
  let medicaidStatus = null;
  const depMap = dependents.reduce(
    (acc, cur) => ({
      ...acc,
      [cur.id]: cur,
    }),
    {},
  );
  results.forEach(res => {
    if (res.isMedicaidCHIP && depMap[res.dependentID]) {
      const { relation, age } = depMap[res.dependentID];
      switch (relation) {
        case 'SELF':
          // The user should be the first result to come back
          medicaidStatus = 'SELF';
          break;
        case 'SPOUSE':
          if (medicaidStatus === 'SELF') {
            medicaidStatus = 'SELF_AND_SPOUSE';
          } else {
            medicaidStatus = 'FAMILY';
          }
          break;
        case 'OTHER_DEPENDENT':
          if (age < 19) {
            numChildren++;
            if (!medicaidStatus) {
              medicaidStatus = 'CHILD';
            } else if (medicaidStatus === 'CHILD') {
              medicaidStatus = 'CHILDREN';
            } else {
              medicaidStatus = 'FAMILY';
            }
          } else {
            medicaidStatus = 'FAMILY';
          }
      }
    }
  });

  return {
    medicaidStatus,
    numChildren,
  };
}

const EligibilityEstimate = ({ children }) => (
  <Query query={ELIGIBILITY_ESTIMATE} fetchPolicy="network-only">
    {({ loading, data }) => {
      const dependents = access(data, 'viewer.health.dependents') || [];
      const estimateList =
        access(data, 'viewer.health.householdEligibilityEstimate') || [];
      const amount = access(
        data,
        'viewer.health.householdEligibilityEstimate[0].advancePremiumTaxCredit',
      );
      const reductions = access(
        data,
        'viewer.health.householdEligibilityEstimate[0].costSharingReductions',
      );

      Log.debug(estimateList);
      Log.debug(dependents);

      const { medicaidStatus, numChildren } = getMedicaidStatus(
        dependents,
        estimateList,
      );

      Log.debug(medicaidStatus);

      return children({
        loading,
        reductions,
        dependents,
        medicaidStatus,
        numChildren,
        amount,
      });
    }}
  </Query>
);

export default EligibilityEstimate;
