import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { calculatePTOMetrics } from '@catch/utils';

import { selectIncome } from './UserInfo';

export const CATCH_UP_TIMEOFF = gql`
  query CatchUpTimeOff {
    viewer {
      income {
        estimatedW2Income
        estimated1099Income
      }
      user {
        id
        workType
      }
    }
  }
`;

export const CatchUpTimeoff = ({ children }) => (
  <Query query={CATCH_UP_TIMEOFF}>
    {({ loading, error, data }) => {
      const workType = access(data, 'viewer.user.workType');
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );

      const grossIncome = selectIncome(
        { estimated1099Income, estimatedW2Income },
        workType,
      );

      const { paycheckPercentage: percentage } = calculatePTOMetrics({
        numberOfDays: 1,
        plannedTarget: 1,
        unplannedTarget: 0,
        round: 4,
      });

      // percentage === 1 day of time off
      const suggestedDepositAmount = percentage * grossIncome;

      return children({
        loading,
        error,
        workType,
        suggestedDepositAmount,
      });
    }}
  </Query>
);

CatchUpTimeoff.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CatchUpTimeoff;
