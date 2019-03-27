import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('plan-history');

export const PLAN_HISTORY = gql`
  query PlanHistory(
    $periodFilter: DatePeriod!
    $pagination: Pagination!
    $transferType: TransferType
    $paycheckType: PaycheckType
  ) {
    viewer {
      planHistorySummary(period: $periodFilter) {
        grossIncome
        grossIncomeW2
        grossIncome1099
        totalSavings #income
        totalSavingsW2
        totalSavings1099
        totalSavingsAll #all contributions
        balances {
          id
          type
          name
          balance #income
          balanceW2
          balance1099
          balanceAll #all contributions
        }
      }
      user {
        id
        workType
      }
      income: transfers(
        paycheckType: $paycheckType
        transferType: $transferType
        pagination: $pagination
        period: $periodFilter
      ) {
        edges {
          id
        }
      }
    }
  }
`;

export const getBalance = ({
  paycheckType,
  balanceAll,
  balanceW2,
  balance1099,
}) => {
  if (paycheckType === 'PAYCHECK_TYPE_W2') {
    return balanceW2;
  } else if (paycheckType === 'PAYCHECK_TYPE_1099') {
    return balance1099;
  } else {
    return balanceAll;
  }
};

const PlanHistory = ({ children, paycheckType = null, periodFilter }) => (
  <Query
    query={PLAN_HISTORY}
    fetchPolicy="cache-and-network"
    variables={{
      periodFilter,
      paycheckType,
      transferType: 'INCOME',
      pagination: {
        pageSize: 1000,
        pageNumber: 1,
      },
    }}
  >
    {({ loading, error, data }) => {
      if (error) Log.error(error);

      const balances = access(data, 'viewer.planHistorySummary.balances');

      let totalSavings;

      if (paycheckType === 'PAYCHECK_TYPE_W2') {
        totalSavings = access(data, 'viewer.planHistorySummary.totalSavingsW2');
      } else if (paycheckType === 'PAYCHECK_TYPE_1099') {
        totalSavings = access(
          data,
          'viewer.planHistorySummary.totalSavings1099',
        );
      } else {
        totalSavings = access(
          data,
          'viewer.planHistorySummary.totalSavingsAll',
        );
      }

      let grossIncome;

      if (paycheckType === 'PAYCHECK_TYPE_W2') {
        grossIncome = access(data, 'viewer.planHistorySummary.grossIncomeW2');
      } else if (paycheckType === 'PAYCHECK_TYPE_1099') {
        grossIncome = access(data, 'viewer.planHistorySummary.grossIncome1099');
      } else {
        grossIncome = access(data, 'viewer.planHistorySummary.grossIncome');
      }

      const income = access(data, 'viewer.income.edges');

      const numberOfPaychecks = income ? income.length : 0;

      const planMetrics =
        balances &&
        balances.map((goalBalance, i) => {
          switch (goalBalance.type) {
            case 'TAX':
              return {
                path: '/taxes',
                title: 'Taxes',
                balance: getBalance({
                  paycheckType,
                  ...goalBalance,
                }),
              };
            case 'PTO':
              return {
                path: '/timeoff',
                title: 'Time Off',
                balance: getBalance({
                  paycheckType,
                  ...goalBalance,
                }),
              };
            case 'RETIREMENT':
              return {
                path: '/retirement',
                title: 'Retirement',
                balance: getBalance({
                  paycheckType,
                  ...goalBalance,
                }),
              };
            default:
              return {
                path: '/plan',
                title: goalBalance.name,
                balance: getBalance({
                  paycheckType,
                  ...goalBalance,
                }),
              };
          }
        });

      Log.debug({
        balances,
        grossIncome,
        planMetrics,
        totalSavings,
        numberOfPaychecks,
      });

      return children({
        loading,
        error,
        planMetrics,
        totalSavings,
        grossIncome,
        numberOfPaychecks,
      });
    }}
  </Query>
);

PlanHistory.propTypes = {
  children: PropTypes.func.isRequired,
  paycheckType: PropTypes.string,
  periodFilter: PropTypes.string.isRequired,
};

export default PlanHistory;
