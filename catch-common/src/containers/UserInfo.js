import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger, requiresIDV } from '@catch/utils';

const Log = createLogger('user-info');

export const USER_INFO = gql`
  query UserInfo {
    viewer {
      user {
        id
        dob
        ssn
        givenName
        familyName
        filingStatus
        acknowledgedAccountDisclosures
        phoneNumber
        isControlPerson
        isFirmAffiliated
        isPoliticallyExposed
        employment {
          occupation
        }
        legalAddress {
          street1
          street2
          city
          state
          zip
          country
        }
        verticalInterest {
          healthInsuranceInterest
          retirementInterest
          lifeInsuranceInterest
        }
        kycSavings {
          needed
          status
        }
        workType
        trustedContact {
          name
          email
          phoneNumber
        }
      }
      taxGoal {
        id
        paycheckPercentage
      }
      income {
        estimatedIncome
        estimated1099Income
        estimatedW2Income
      }
      spouseIncome
      incomeState
      retirementGoal {
        id
        hasUploadedSignature
      }
      documentUploads {
        provider
        type
      }
      survey {
        id
        hasFinished
      }
    }
  }
`;

/**
 * The estimatedIncome is either a specific income base on workType
 * or both types added if mix. This might change
 * @NOTE the metadata is usually used for tax calculation so we use 1099 income
 */
export function selectIncome(income = {}, workType) {
  switch (workType) {
    case 'WORK_TYPE_W2':
      return income.estimatedW2Income;
    case 'WORK_TYPE_1099':
      return income.estimated1099Income;
    case 'WORK_TYPE_DIVERSIFIED':
      return (
        Number(income.estimatedW2Income) + Number(income.estimated1099Income)
      );
  }
}

/**
 * Maybe we could make this a general purpose user info data provider
 * just need to figure out how to use fragments
 */
const UserInfo = ({ children }) => (
  <Query query={USER_INFO} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      if (error) Log.error(error);

      const workType = access(data, 'viewer.user.workType');
      const estimatedIncome = access(data, 'viewer.income.estimatedIncome');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const spouseIncome = access(data, 'viewer.spouseIncome');
      const incomeState = access(data, 'viewer.incomeState');
      const filingStatus = access(data, 'viewer.user.filingStatus');
      const acknowledgedAccountDisclosures = access(
        data,
        'viewer.user.acknowledgedAccountDisclosures',
      );
      const legalAddress = access(data, 'viewer.user.legalAddress');

      const street1 = access(data, 'viewer.user.legalAddress.street1');
      const street2 = access(data, 'viewer.user.legalAddress.street2');
      const city = access(data, 'viewer.user.legalAddress.city');
      const state = access(data, 'viewer.user.legalAddress.state');
      const zip = access(data, 'viewer.user.legalAddress.zip');
      const country = access(data, 'viewer.user.legalAddress.country');

      const ssn = access(data, 'viewer.user.ssn');
      const occupation = access(data, 'viewer.user.employment.occupation');
      const phoneNumber = access(data, 'viewer.user.phoneNumber');

      const isControlPerson = access(data, 'viewer.user.isControlPerson');
      const isFirmAffiliated = access(data, 'viewer.user.isFirmAffiliated');
      const isPoliticallyExposed = access(
        data,
        'viewer.user.isPoliticallyExposed',
      );

      const taxPercentage = access(data, 'viewer.taxGoal.paycheckPercentage');

      const kycStatus = access(data, 'viewer.user.kycSavings.status');
      const kycNeeded = access(data, 'viewer.user.kycSavings.needed');

      const trustedContact = access(data, 'viewer.user.trustedContact');

      const isIneligible =
        // if user is denied by bbva
        kycStatus === 'KYC_DENIED' ||
        isControlPerson ||
        isFirmAffiliated ||
        isPoliticallyExposed;

      const hasValidLegalAddress =
        !!street1 && !!city && !!state && !!zip && !!country;

      const hasEmployment = !!occupation;
      const hasSSN = !!ssn;

      const metaData = {
        workState: access(data, 'viewer.incomeState'),
        annualIncome: estimated1099Income || estimatedW2Income,
        estimatedW2Income,
        estimated1099Income,
        spouseIncome: access(data, 'viewer.spouseIncome'),
        filingStatus: access(data, 'viewer.user.filingStatus'),
        occupation,
      };

      const dob = access(data, 'viewer.user.dob');
      const givenName = access(data, 'viewer.user.givenName');
      const familyName = access(data, 'viewer.user.familyName');
      const legalName = Boolean(givenName && familyName)
        ? `${givenName} ${familyName}`
        : undefined;

      const documentUploads = access(data, 'viewer.documentUploads');

      const needsIdv = requiresIDV(kycNeeded, documentUploads);

      const needsRegulatory =
        isControlPerson === null ||
        isFirmAffiliated === null ||
        isPoliticallyExposed === null;

      const isNotRisky =
        isControlPerson === false &&
        isFirmAffiliated === false &&
        isPoliticallyExposed === false;

      const hasUploadedRetirementSignature = access(
        data,
        'viewer.retirementGoal.hasUploadedSignature',
      );

      const hasFinishedSurvey = access(data, 'viewer.survey.hasFinished');

      return children({
        loading,
        error,
        givenName,
        familyName,
        legalName,
        filingStatus,
        dob,
        taxPercentage,
        estimatedIncome: selectIncome(
          {
            estimatedW2Income,
            estimated1099Income,
          },
          workType,
        ),
        estimated1099Income,
        estimatedW2Income,
        spouseIncome,
        incomeState,
        legalAddress: { street1, street2, city, state, zip, country },
        occupation,
        workType,
        ssn,
        phoneNumber,
        acknowledgedAccountDisclosures,
        hasValidLegalAddress,
        hasEmployment,
        hasSSN,
        metaData,
        kycStatus,
        kycNeeded,
        isFirmAffiliated,
        isPoliticallyExposed,
        isControlPerson,
        needsIdv,
        needsRegulatory,
        isIneligible,
        isNotRisky,
        trustedContact,
        hasUploadedRetirementSignature,
        disclosures: {
          isFirmAffiliated,
          isPoliticallyExposed,
          isControlPerson,
        },
        hasFinishedSurvey,
      });
    }}
  </Query>
);

export default UserInfo;
