import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';
import compareDesc from 'date-fns/compare_desc';
import { accountRef, createLogger, getAccount } from '@catch/utils';

const Log = createLogger('plan-activity');

export const PLAN_ACTIVITY = gql`
  query PlanActivity(
    $pagination: Pagination!
    $rewardsStatus: RewardStatus!
    $periodFilter: DatePeriod!
    $paycheckType: PaycheckType
  ) {
    viewer {
      deposits: transfers(
        pagination: $pagination
        direction: DEPOSIT
        period: $periodFilter
        paycheckType: $paycheckType
      ) {
        edges {
          id
          amount
          createdOn
          completionDate
          isPending
          status
          incomeAmount
          type
          transactions {
            id
            amount
            goalType
            incomeAmount
            accountID
            date
            expectedDate
            completionDate
            isPending
          }
          aggregationAccount {
            id
            accountNumber
            name
          }
        }
      }
      transfers(
        pagination: $pagination
        direction: WITHDRAWAL
        period: $periodFilter
      ) {
        edges {
          id
          amount
          createdOn
          completionDate
          isPending
          status
          transactions {
            id
            amount
            goalType
            expectedDate
            completionDate
          }
          aggregationAccount {
            id
            accountNumber
            name
          }
        }
      }
      taxGoal {
        id
        status
        isAccountReady
        createdOn
        paycheckPercentage
      }
      ptoGoal {
        id
        status
        isAccountReady
        createdOn
        paycheckPercentage
      }
      retirementGoal {
        id
        status
        isAccountReady
        createdOn
        paycheckPercentage
      }
      pendingRewards(status: $rewardsStatus) {
        amount
      }
      primaryAccount {
        id
        name
        accountNumber
      }
      bankLinks {
        id
        accounts {
          id
          accountNumber
        }
        bank {
          id
          name
        }
      }
    }
  }
`;

const types = {
  DEPOSIT: 'deposit',
  WITHDRAWAL: 'withdrawal',
  NEW_PLAN: 'new-plan',
  REFERRAL_BONUS: 'referral-bonus',
};

const PlanActivity = ({
  children,
  paycheckType = null,
  periodFilter,
  goalType,
}) => (
  <Query
    query={PLAN_ACTIVITY}
    variables={{
      pagination: {
        pageNumber: 20,
        pageSize: 20,
      },
      rewardsStatus: 'PENDING',
      periodFilter,
      paycheckType,
    }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data, refetch }) => {
      const goalID = !!goalType && access(data, `viewer.${goalType}Goal.id`);

      const withdrawals = access(data, 'viewer.transfers.edges');
      const deposits = access(data, 'viewer.deposits.edges');
      const bankLinks = access(data, 'viewer.bankLinks');

      const primaryAccountName = access(data, 'viewer.primaryAccount.name');
      const primaryAccountNumber = access(
        data,
        'viewer.primaryAccount.accountNumber',
      );

      let items = [];

      // If the plan is processing we still want a card to tell the user
      const isTaxGoalActive =
        access(data, 'viewer.taxGoal.status') === 'ACTIVE' ||
        access(data, 'viewer.taxGoal.status') === 'PAUSED';
      const isTaxGoalProcessing =
        isTaxGoalActive &&
        access(data, 'viewer.taxGoal.isAccountReady') === false;
      // If we have a pto goalType we don't show the tax card
      if (
        (isTaxGoalProcessing &&
          goalType !== 'pto' &&
          goalType !== 'retirement') ||
        (isTaxGoalActive && goalType !== 'pto' && goalType !== 'retirement')
      ) {
        items = items.concat([
          {
            type: types.NEW_PLAN,
            status: isTaxGoalProcessing ? 'PROCESSING' : 'READY',
            goalName: 'Taxes',
            date: access(data, 'viewer.taxGoal.createdOn'),
            percentage: access(data, 'viewer.taxGoal.paycheckPercentage'),
          },
        ]);
      }

      const isRetirementGoalActive =
        access(data, 'viewer.retirementGoal.status') === 'ACTIVE' ||
        access(data, 'viewer.retirementGoal.status') === 'PAUSED';
      const isRetirementGoalProcessing =
        isRetirementGoalActive &&
        access(data, 'viewer.retirementGoal.isAccountReady') === false;

      if (
        (isRetirementGoalProcessing &&
          goalType !== 'pto' &&
          goalType !== 'tax') ||
        (isRetirementGoalActive && goalType !== 'pto' && goalType !== 'tax')
      ) {
        items = items.concat([
          {
            type: types.NEW_PLAN,
            status: isRetirementGoalProcessing ? 'PROCESSING' : 'READY',
            goalName: 'Retirement',
            date: access(data, 'viewer.retirementGoal.createdOn'),
            percentage: access(
              data,
              'viewer.retirementGoal.paycheckPercentage',
            ),
          },
        ]);
      }

      const isPTOGoalActive =
        access(data, 'viewer.ptoGoal.status') === 'ACTIVE' ||
        access(data, 'viewer.ptoGoal.status') === 'PAUSED';
      const isPTOGoalProcessing =
        isPTOGoalActive &&
        access(data, 'viewer.ptoGoal.isAccountReady') === false;
      if (
        (isPTOGoalProcessing &&
          goalType !== 'tax' &&
          goalType !== 'retirement') ||
        (isPTOGoalActive && goalType !== 'tax' && goalType !== 'retirement')
      ) {
        items = items.concat([
          {
            type: types.NEW_PLAN,
            status: isPTOGoalProcessing ? 'PROCESSING' : 'READY',
            goalName: 'Time off',
            date: access(data, 'viewer.ptoGoal.createdOn'),
            percentage: access(data, 'viewer.ptoGoal.paycheckPercentage'),
          },
        ]);
        // We should be only getting rewards which transfer is processing
        const pendingRewards = access(data, 'viewer.pendingRewards');
        Log.debug(pendingRewards);
        if (Array.isArray(pendingRewards) && pendingRewards.length > 0) {
          items = items.concat([
            {
              type: types.REFERRAL_BONUS,
              status: 'PROCESSING',
              date: access(data, 'viewer.ptoGoal.createdOn'),
              amount: pendingRewards[0].amount,
              transferAmount: pendingRewards[0].amount,
              depositType: 'REFERRAL',
            },
          ]);
        }

        // If they're in here they should be fully processed
        if (Array.isArray(deposits)) {
          const rewards = deposits.filter(deposit =>
            /Reward/.test(deposit.description),
          );
          items = items.concat(
            rewards.map(reward => ({
              type: types.REFERRAL_BONUS,
              status: reward.status,
              date: reward.completionDate,
              transferAmount: reward.amount,
              depositType: 'REWARD',
            })),
          );
        }
      }

      // If we have a goalID we use the goal's specific amount
      if (!!deposits && deposits.length > 0) {
        for (let i = 0, n = deposits.length; i < n; i++) {
          if (deposits[i].transactions.length > 0) {
            const goal =
              !!goalID &&
              deposits[i].transactions.find(bd => bd.accountID === goalID);

            // if we're on a vertical page, sort through deposits to find pertinent income transactions and values
            if (
              goalType &&
              goal &&
              goal.goalType.toLowerCase() === goalType &&
              goal.status !== 'INCOME_ACTION_SKIPPED' &&
              goal.status !== 'INCOME_ACTION_USER_PENDING'
            ) {
              items = items.concat({
                type: types.DEPOSIT,
                depositType: deposits[i].type,
                txID: deposits[i].id,
                amount: goal.amount,
                status:
                  // it's a possible that a retirement transfer to BBVA can come back as settled, but the transaction to Folio is still pending. Use the isPending bool on the transfer to determine if the entire transfer is pending or not
                  goalType === 'retirement'
                    ? goal.isPending
                      ? 'PROCESSING'
                      : deposits[i].status
                    : deposits[i].status,
                incomeAmount: deposits[i].incomeAmount,
                date: deposits[i].createdOn,
                goalType: goalType,
                bankReference: !!deposits[i].aggregationAccount
                  ? accountRef({
                      accountName: deposits[i].aggregationAccount.name,
                      accountNumber:
                        deposits[i].aggregationAccount.accountNumber,
                    })
                  : accountRef({
                      accountName: primaryAccountName,
                      accountNumber: primaryAccountNumber,
                    }),
                savingsBreakdowns: deposits[i].transactions.map(
                  tx =>
                    (tx.goalType === 'TAX' || tx.goalType === 'PTO') && {
                      id: tx.id,
                      amount: tx.amount,
                      goalType: tx.goalType,
                    },
                ),
                expectedDate: deposits[i].transactions[0].expectedDate,
                // transactions without completion date should error, use the transfer's completion date as backup
                completionDate:
                  deposits[i].transactions[0].completionDate ||
                  deposits[i].completionDate,
              });
            }

            // When we create a new goal it will not appear in the past transaction
            // breakdowns
            if (!goalType) {
              items = items.concat({
                type: types.DEPOSIT,
                depositType: deposits[i].type,
                txID: deposits[i].id,
                amount: deposits[i].amount,
                status: deposits[i].status,
                incomeAmount: deposits[i].incomeAmount,
                date: deposits[i].createdOn,
                // WE'RE ONLY ALLOWING GOAL SPECIFIC DEPOSITS, THRERE WOULD NEVER BE MORE THAN 1 TRANSACTION
                goalType:
                  !!deposits[i].transactions[0].goalType &&
                  deposits[i].transactions[0].goalType,
                bankReference: deposits[i].aggregationAccount
                  ? accountRef({
                      accountName: deposits[i].aggregationAccount.name,
                      accountNumber:
                        deposits[i].aggregationAccount.accountNumber,
                    })
                  : accountRef({
                      accountName: primaryAccountName,
                      accountNumber: primaryAccountNumber,
                    }),
                breakdowns: deposits[i].transactions.map(tx => ({
                  id: tx.id,
                  amount: tx.amount,
                  goalType: tx.goalType,
                })),
                expectedDate: deposits[i].transactions[0].expectedDate,
                // transactions without completion date should error, use the transfer's completion date as backup
                completionDate:
                  deposits[i].transactions[0].completionDate ||
                  deposits[i].completionDate,
              });
            }
          }
        }
      }
      const taxWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(
            (wd, id) => !!wd.transactions.find(tx => tx.goalType === 'TAX'),
          )
        : [];
      // If we have a goalType we only include withdrawals for that goal
      if (
        (!!taxWithdrawals && taxWithdrawals.length > 0 && !goalType) ||
        (!!taxWithdrawals && taxWithdrawals.length > 0 && goalType === 'tax')
      ) {
        items = items.concat(
          taxWithdrawals.map((w, i) => {
            const account = getAccount(bankLinks, w.aggregationAccountID);
            return {
              type: types.WITHDRAWAL,
              txID: w.id.slice(0, 8),
              status: w.status,
              amount: w.amount,
              transferAmount: w.amount,
              date: w.isPending ? w.createdOn : w.completionDate,
              bankReference: !!taxWithdrawals[i].aggregationAccount
                ? accountRef({
                    accountName: taxWithdrawals[i].aggregationAccount.name,
                    accountNumber:
                      taxWithdrawals[i].aggregationAccount.accountNumber,
                  })
                : accountRef({
                    accountName: primaryAccountName,
                    accountNumber: primaryAccountNumber,
                  }),
              breakdowns: w.transactions.map(tx => ({
                id: tx.id,
                amount: tx.amount,
                goalType: tx.goalType,
              })),
              expectedDate: taxWithdrawals[i].transactions[0].expectedDate,
              // transactions without completion date should error, use the transfer's completion date as backup
              completionDate:
                taxWithdrawals[i].transactions[0].completionDate ||
                taxWithdrawals[i].completionDate,
            };
          }),
        );
      }
      const ptoWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(
            (wd, id) => !!wd.transactions.find(tx => tx.goalType === 'PTO'),
          )
        : [];
      if (
        (!!ptoWithdrawals && ptoWithdrawals.length > 0 && !goalType) ||
        (!!ptoWithdrawals && ptoWithdrawals.length > 0 && goalType === 'pto')
      ) {
        items = items.concat(
          ptoWithdrawals.map((w, i) => {
            const account = getAccount(bankLinks, w.aggregationAccountID);
            return {
              type: types.WITHDRAWAL,
              txID: w.id.slice(0, 8),
              status: w.status,
              amount: w.amount,
              transferAmount: w.amount,
              date: w.isPending ? w.createdOn : w.completionDate,
              bankReference: !!ptoWithdrawals[i].aggregationAccount
                ? accountRef({
                    accountName: ptoWithdrawals[i].aggregationAccount.name,
                    accountNumber:
                      ptoWithdrawals[i].aggregationAccount.accountNumber,
                  })
                : accountRef({
                    accountName: primaryAccountName,
                    accountNumber: primaryAccountNumber,
                  }),
              breakdowns: w.transactions.map(tx => ({
                id: tx.id,
                amount: tx.amount,
                goalType: tx.goalType,
              })),
              expectedDate: ptoWithdrawals[i].transactions[0].expectedDate,
              // transactions without completion date should error, use the transfer's completion date as backup
              completionDate:
                ptoWithdrawals[i].transactions[0].completionDate ||
                ptoWithdrawals[i].completionDate,
            };
          }),
        );
      }
      items = items.sort((a, b) => compareDesc(a.date, b.date));
      Log.debug(items);
      return children({ loading, error, items });
    }}
  </Query>
);

PlanActivity.propTypes = {
  children: PropTypes.func.isRequired,
  goalType: PropTypes.string,
  periodFilter: PropTypes.string,
};

PlanActivity.defaultProps = {
  periodFilter: 'ANY',
};

export default PlanActivity;
