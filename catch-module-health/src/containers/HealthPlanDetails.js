import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';
import { sortBenefits } from '../utils';

const Log = createLogger('health-plan-details');

export const HEALTH_PLAN_DETAILS = gql`
  query HealthPlanDetails($id: ID!) {
    viewer {
      health {
        dependents {
          id
          relation
        }
        information {
          providerPlanID
        }
        householdEligibilityEstimate {
          dependentID
          advancePremiumTaxCredit
          isMedicaidCHIP
          costSharingReductions
        }
        plan(id: $id) {
          id
          name
          benefits {
            name
            covered
            costSharings {
              coinsuranceOptions
              coinsuranceRate
              copayAmount
              copayOptions
              networkTier
              csr
              displayString
            }
            explanation
            hasLimits
            limitUnit
            limitQuantity
          }
          deductibles {
            amount
            csr
            familyCost
            networkTier
            type
          }
          diseaseManagementPrograms
          hasNationalNetwork
          insuranceMarket
          issuer {
            eligibleDependents
            individualURL
            name
            shopURL
            state
            tollFree
            tty
          }
          market
          maxAgeChild
          metalLevel
          moops {
            amount
            csr
            familyCost
            networkTier
            type
          }
          premium
          premiumWithCredit
          ehbPremium
          pediatricEHBPremium
          aptcEligiblePremium
          guaranteedRate
          simpleChoice
          productDivision
          specialistReferralRequired
          state
          type
          benefitsURL
          brochureURL
          formularyURL
          networkURL
          hsaEligible
          oopc
          suppression
          sbcs {
            baby {
              deductible
              copay
              coinsurance
              limit
            }
            diabetes {
              deductible
              copay
              coinsurance
              limit
            }
            fracture {
              deductible
              copay
              coinsurance
              limit
            }
          }
          isIneligible
        }
      }
    }
  }
`;

const HealthPlanDetails = ({ children, planID }) => (
  <Query
    query={HEALTH_PLAN_DETAILS}
    variables={{ id: planID }}
    skip={!planID}
    fetchPolicy="network-only"
  >
    {({ loading, data, error }) => {
      const get = access(data);
      // Government savings based on previous estimate
      const monthlySavings = get(
        'viewer.health.householdEligibilityEstimate[0].advancePremiumTaxCredit',
      );
      const dependents = get('viewer.health.dependents') || [];
      const hasDependents = dependents.length > 1;
      // A human readable reference to the plan
      const planName = get('viewer.health.plan.name');
      // The company providing the health plan
      const provider = get('viewer.health.plan.issuer.name');
      // HMO, PPO...
      const planType = get('viewer.health.plan.type');
      // Silver, Gold
      const metalLevel = get('viewer.health.plan.metalLevel');
      // Insurance premium
      const monthlyPremium = get('viewer.health.plan.premium');
      // The amount users pay before the insurance company starts to pay
      const yearlyDeduct = hasDependents
        ? get('viewer.health.plan.deductibles')
        : get('viewer.health.plan.deductibles.find().amount', [
            ded =>
              ded.familyCost === 'Family Per Person' ||
              ded.familyCost === 'Individual',
          ]);
      // Maximum out of pocket
      const yearlyMoop = hasDependents
        ? get('viewer.health.plan.moops')
        : get('viewer.health.plan.moops.find().amount', [
            moop =>
              moop.familyCost === 'Family Per Person' ||
              moop.familyCost === 'Individual',
          ]);

      // Generally copays are nicer to display for people to understand
      // else we just use the description
      const getServiceCost = service => {
        const getBenefit = ben => new RegExp(service).test(ben.name);
        const coinsuranceOptions = get(
          'viewer.health.plan.benefits.find().costSharings[0].coinsuranceOptions',
          [getBenefit],
        );
        const coinsuranceRate = get(
          'viewer.health.plan.benefits.find().costSharings[0].coinsuranceRate',
          [getBenefit],
        );
        const copayAmount = get(
          'viewer.health.plan.benefits.find().costSharings[0].copayAmount',
          [getBenefit],
        );
        const copayOptions = get(
          'viewer.health.plan.benefits.find().costSharings[0].copayOptions',
          [getBenefit],
        );
        const displayString = get(
          'viewer.health.plan.benefits.find().costSharings[0].displayString',
          [getBenefit],
        );
        const description = /Coinsurance/.test(displayString)
          ? `${displayString.split(' ')[0]} cost`
          : displayString === 'No Charge After Deductible'
            ? 'Free after deductible'
            : displayString;
        return copayAmount || description;
      };
      // Primary care visit cost
      const primaryCare = getServiceCost('Primary');
      // Emergency visit cost
      const emergency = getServiceCost('Emergency');
      // Specialist visit cost
      const specialist = getServiceCost('Specialist');
      // Basic drugs costs
      const drugs = getServiceCost('Drugs');
      // Provider brochure url
      const planBrochure = get('viewer.health.plan.brochureURL');

      const planBenefits = get('viewer.health.plan.benefits') || [];

      const benefits = sortBenefits(planBenefits);

      const savedPlanID = get('viewer.health.information.providerPlanID');

      Log.debug(data);

      return children({
        error,
        loading,
        monthlySavings,
        savedPlanID,
        planName,
        provider,
        planType,
        metalLevel,
        monthlyPremium,
        yearlyDeduct,
        yearlyMoop,
        primaryCare,
        emergency,
        specialist,
        drugs,
        benefits,
        planBrochure,
      });
    }}
  </Query>
);

export default HealthPlanDetails;
