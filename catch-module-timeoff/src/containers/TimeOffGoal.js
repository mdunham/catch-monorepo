import React from 'react';
import gql from 'graphql-tag';
import { func } from 'prop-types';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';
import { selectIncome } from '@catch/common';

const Log = createLogger('timeoff-goal');

export const TIME_OFF_GOAL_QUERY = gql`
  query TimeOffGoal {
    viewer {
      user {
        id
        workType
      }
      income {
        estimated1099Income
        estimatedW2Income
      }
      ptoGoal {
        id
        plannedTarget
        unplannedTarget
        paycheckPercentage
        status
        availableBalance
        isAccountReady
      }
      savingsAccountMetadata {
        isAccountReady
        isAccountLocked
      }
    }
  }
`;

const estimatorInitials = {
  PLANNED: 10,
  UNPLANNED: 5,
};

export const TimeOffGoal = ({ children }) => (
  <Query query={TIME_OFF_GOAL_QUERY} fetchPolicy="cache-and-network">
    {({ loading, error, data, refetch }) => {
      // Null | Object
      const ptoGoal = access(data, 'viewer.ptoGoal');
      // undefined | string
      const goalID = access(data, 'viewer.ptoGoal.id');
      // number | initial values for the estimator
      // @NOTE so we don't have to worry about these values going up the tree
      const plannedTarget =
        access(data, 'viewer.ptoGoal.plannedTarget') ||
        estimatorInitials.PLANNED;
      const unplannedTarget =
        access(data, 'viewer.ptoGoal.unplannedTarget') ||
        estimatorInitials.UNPLANNED;
      // undefined
      const paycheckPercentage = access(
        data,
        'viewer.ptoGoal.paycheckPercentage',
      );
      // undefined | string
      const status = access(data, 'viewer.ptoGoal.status');

      // undefined | number
      const availableBalance = access(data, 'viewer.ptoGoal.availableBalance');

      // undefined | boolean
      const isAccountLocked = access(
        data,
        'viewer.savingsAccountMetadata.isAccountLocked',
      );

      // undefined | boolean
      const isAccountReady =
        !isAccountLocked &&
        access(data, 'viewer.savingsAccountMetadata.isAccountReady');
      // undefind (loading) | number

      // string
      const workType = access(data, 'viewer.user.workType');

      //number
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');

      const annualIncome = selectIncome(
        {
          estimatedW2Income,
          estimated1099Income,
        },
        workType,
      );

      // number
      const totalTarget = plannedTarget + unplannedTarget;

      return children({
        isGoalStarted: !!ptoGoal,
        goalID,
        availableBalance,
        paycheckPercentage,
        plannedTarget,
        unplannedTarget,
        isAccountReady,
        annualIncome,
        estimatedW2Income,
        estimated1099Income,
        totalTarget,
        workType,
        status,
        loading,
        error,
        refetch,
      });
    }}
  </Query>
);

TimeOffGoal.propTypes = { children: func.isRequired };

export default TimeOffGoal;
