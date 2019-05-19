import React from 'react';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { selectIncome } from '@catch/common';
import {
  convertUnixTimeToAge,
  precisionRound,
  getAnnualContributionLimit,
} from '@catch/utils';

export const RETIREMENT_GOAL_QUERY = gql`
  query RetirementGoalQuery {
    viewer {
      retirementGoal {
        id
        status
        paycheckPercentage
        riskLevel
        riskComfort
        externalSavings
        accountType
        isAccountReady
        portfolio {
          id
          name
        }
        wealthAccount {
          totalContributions
          growth
          balance
        }
      }
      user {
        id
        dob
        givenName
        familyName
        workType
      }
      income {
        estimatedW2Income
        estimated1099Income
      }
      savingsAccountMetadata {
        isAccountReady
      }
    }
  }
`;

export const RetirementGoal = ({ children }) => (
  <Query query={RETIREMENT_GOAL_QUERY} fetchPolicy="cache-and-network">
    {({ loading, error, data, refetch }) => {
      const id = access(data, 'viewer.retirementGoal.id');
      const status = access(data, 'viewer.retirementGoal.status');
      const currentPaycheckPercentage = precisionRound(
        access(data, 'viewer.retirementGoal.paycheckPercentage'),
        2,
      );
      const riskComfort = access(data, 'viewer.retirementGoal.riskComfort');
      const riskLevel = access(data, 'viewer.retirementGoal.riskLevel');
      const externalSavings = access(
        data,
        'viewer.retirementGoal.externalSavings',
      );
      const accountType = access(data, 'viewer.retirementGoal.accountType');
      const isAccountReady = access(
        data,
        'viewer.retirementGoal.isAccountReady',
      );

      const isAccountLocked = access(
        data,
        'viewer.savingsAccountMetadata.isAccountLocked',
      );

      const isSavingsAccountReady =
        !isAccountLocked &&
        access(data, 'viewer.savingsAccountMetadata.isAccountReady');

      const portfolio = access(data, 'viewer.retirementGoal.portfolio');
      const portfolioID = access(data, 'viewer.retirementGoal.portfolio.id');
      const portfolioName = access(
        data,
        'viewer.retirementGoal.portfolio.name',
      );

      const workType = access(data, 'viewer.user.workType');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const estimatedIncome = selectIncome(
        {
          estimatedW2Income,
          estimated1099Income,
        },
        workType,
      );

      const dob = access(data, 'viewer.user.dob');
      const age = dob && convertUnixTimeToAge(dob);

      const startedRetirementGoal = !!access(data, 'viewer.retirementGoal');

      const legalName = `${access(data, 'viewer.user.givenName')} ${access(
        data,
        'viewer.user.familyName',
      )}`;

      const balance = access(
        data,
        'viewer.retirementGoal.wealthAccount.balance',
      );

      // postive/negative metric for portfolio performance
      // if user doesnt have a balance on their wealth goal, dont show growth metric
      const growth = access(data, 'viewer.retirementGoal.wealthAccount.growth');

      const growthDirection =
        growth !== 0 ? (growth > 0 ? 'UP' : 'DOWN') : 'NEUTRAL';

      // only show growth metric if the user's retirement account has as a balance
      const showGrowth = balance > 0;

      // a user's contributions towards retirement this calendar year (resets at new year)
      const totalContributions = access(
        data,
        'viewer.retirementGoal.wealthAccount.totalContributions',
      );

      // if user has yet to reach the annual contribution limit, we allow them to deposit
      const accountFullyFunded =
        totalContributions &&
        totalContributions === getAnnualContributionLimit();

      return children({
        loading,
        error,
        refetch,
        startedRetirementGoal,
        id,
        status,
        currentPaycheckPercentage,
        riskLevel,
        riskComfort,
        externalSavings,
        accountType,
        isAccountReady,
        portfolio,
        portfolioID,
        portfolioName,
        age,
        estimatedIncome,
        estimatedW2Income,
        estimated1099Income,
        legalName,
        balance,
        workType,
        isSavingsAccountReady,
        growth,
        growthDirection,
        showGrowth,
        accountFullyFunded,
      });
    }}
  </Query>
);

RetirementGoal.propTypes = { children: PropTypes.func.isRequired };

export default RetirementGoal;
