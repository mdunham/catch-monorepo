import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const HEALTH_INSURANCE = gql`
  query HealthInsurance {
    viewer {
      user {
        id
        familyName
      }
      health {
        insurance {
          id
          carrier
          planName
          insuranceSource
          policyNumber
          phoneNumber
          notes
          card {
            front {
              id
              url
            }
            back {
              id
              url
            }
          }
        }
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
          didEnroll
          exitStage
        }
        dependents {
          id
          age
          relation
        }
        doctors {
          id
          name
          phoneNumber
          type
        }
        recommendation {
          id
          needBasedImportance
        }
      }
    }
  }
`;

const HealthInsurance = ({ children }) => (
  <Query query={HEALTH_INSURANCE} fetchPolicy="network-only">
    {({ data, loading, error }) => {
      const get = access(data);
      const id = get('viewer.health.insurance.id');
      const carrier = get('viewer.health.insurance.carrier');
      const planName = get('viewer.health.insurance.planName');
      const insuranceSource = get('viewer.health.insurance.insuranceSource');
      const policyNumber = get('viewer.health.insurance.policyNumber');
      const phoneNumber = get('viewer.health.insurance.phoneNumber');
      const notes = get('viewer.health.insurance.notes');

      // used for uploading images to S3
      const familyName = get('viewer.user.familyName');

      // We only care if the answer is yes here
      const didEnroll = get('viewer.health.information.didEnroll') === 'YES';
      const exitStage = get('viewer.health.information.exitStage');
      const providerPlan = get('viewer.health.information.providerPlan');
      const dependents = get('viewer.health.dependents');

      const frontImageUrl = access(
        data,
        'viewer.health.insurance.card.front.url',
      );
      const backImageUrl = access(
        data,
        'viewer.health.insurance.card.back.url',
      );

      const doctors = access(data, 'viewer.health.doctors');

      const healthInsuranceRecommendation = {
        id: get('viewer.health.recommendation.id'),
        needBasedImportance: get(
          'viewer.health.recommendation.needBasedImportance',
        ),
      };

      const initialValues = {
        carrier,
        planName,
        insuranceSource,
        policyNumber,
        phoneNumber,
        notes,
      };

      return children({
        insuranceSource,
        initialValues,
        policyNumber,
        phoneNumber,
        familyName,
        planName,
        carrier,
        notes,
        initialValues,
        familyName,
        frontImageUrl,
        backImageUrl,
        doctors,
        id,
        didEnroll,
        exitStage,
        dependents,
        providerPlan,
        healthInsuranceRecommendation,
        loading,
        error,
      });
    }}
  </Query>
);

HealthInsurance.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HealthInsurance;
