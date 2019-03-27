import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('transaction-breakdown');

export const INCOME_BREAKDOWN = gql`
  query ActiveGoalsAndIncomeTransaction($id: ID!) {
    viewer {
      user {
        id
        workType
      }
      taxGoal {
        id
        status
      }
      retirementGoal {
        id
        status
      }
      ptoGoal {
        id
        status
      }
      incomeTransaction(id: $id) {
        id
        amount
        date
        status
        actedOn
        goalBreakdowns {
          id
          type
          goalID
          description
          amount
          percentage
        }
      }
      primaryAccount {
        id
        name
        balance
        bankLink {
          id
          bank {
            id
            name
          }
          syncStatus
        }
      }
    }
  }
`;

const isActive = goal => !!goal && goal.status === 'ACTIVE';

const IncomeBreakdown = ({ children, id, paycheckType }) => (
  <Query
    query={INCOME_BREAKDOWN}
    variables={{ id }}
    fetchPolicy="cache-and-network"
  >
    {({ data, loading, error }) => {
      const amount = access(data, 'viewer.incomeTransaction.amount');
      const date = access(data, 'viewer.incomeTransaction.date');
      const goalBreakdowns = access(
        data,
        'viewer.incomeTransaction.goalBreakdowns',
      );
      const actedOn = access(data, 'viewer.incomeTransaction.actedOn');
      const txStatus = access(data, 'viewer.incomeTransaction.status');

      const taxGoal = access(data, 'viewer.taxGoal');
      const ptoGoal = access(data, 'viewer.ptoGoal');
      const retirementGoal = access(data, 'viewer.retirementGoal');

      const workType = access(data, 'viewer.user.workType');

      const bankName = access(data, 'viewer.primaryAccount.bankLink.bank.name');
      const balance = access(data, 'viewer.primaryAccount.balance');

      const syncGood =
        access(data, 'viewer.primaryAccount.bankLink.syncStatus') === 'GOOD';

      // This makes sure the goals are active even if they're available in the breakdown
      let contributions = [];
      if (
        workType === 'WORK_TYPE_DIVERSIFIED'
          ? !!paycheckType &&
            paycheckType !== 'PAYCHECK_TYPE_W2' &&
            isActive(taxGoal)
          : isActive(taxGoal)
      ) {
        const item = goalBreakdowns.find(bd => bd.goalID === taxGoal.id);
        if (item) contributions = contributions.concat([item]);
      }
      if (isActive(ptoGoal)) {
        const item = goalBreakdowns.find(bd => bd.goalID === ptoGoal.id);
        if (item) contributions = contributions.concat([item]);
      }
      if (isActive(retirementGoal)) {
        const item = goalBreakdowns.find(bd => bd.goalID === retirementGoal.id);
        if (item) contributions = contributions.concat([item]);
      }
      Log.debug(contributions);
      return children({
        loading,
        error,
        amount,
        date,
        contributions,
        workType,
        bankName,
        balance,
        ok: syncGood,
        actedOn,
        txStatus,
      });
    }}
  </Query>
);

export default IncomeBreakdown;
