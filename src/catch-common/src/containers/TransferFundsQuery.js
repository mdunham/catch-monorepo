import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import {
  createLogger,
  accountRef,
  getAnnualContributionLimit,
} from '@catch/utils';

import { GOAL_ACCOUNTS } from '../utils';

const Log = createLogger('transfer-funds-query');

const DAILY_DEPOSIT_LIMIT = 2500;

export const TRANSFER_FUNDS_QUERY = gql`
  query TransferFundQuery {
    viewer {
      primaryAccount {
        id
        name
        accountNumber
        balance
      }
      taxGoal {
        id
        availableBalance
        status
        isAccountReady
      }
      ptoGoal {
        id
        availableBalance
        status
        isAccountReady
      }
      retirementGoal {
        id
        status
        isAccountReady
        wealthAccount {
          totalContributions
          balance
        }
      }
      recentDeposits
    }
  }
`;

export const isValidGoalForDeposit = goal =>
  !!goal &&
  (goal.status === 'ACTIVE' || goal.status === 'PAUSED') &&
  !!goal.isAccountReady;
export const isValidGoalForWithdrawal = goal =>
  !!goal && goal.availableBalance > 0;

export const TransferFundsQuery = ({
  children,
  goalType,
  transferAmount,
  transferType,
}) => (
  <Query query={TRANSFER_FUNDS_QUERY}>
    {({ loading, error, data }) => {
      Log.info(data);

      const primaryAccountName = access(data, 'viewer.primaryAccount.name');
      const primaryAccountNumber = access(
        data,
        'viewer.primaryAccount.accountNumber',
      );
      const primaryAccountBalance = access(
        data,
        'viewer.primaryAccount.balance',
      );

      // the amount a user has contributed to their wealth account this calendar year
      const wealthAccountContributions = access(
        data,
        'viewer.retirementGoal.wealthAccount.totalContributions',
      );

      const taxGoal = access(data, 'viewer.taxGoal');
      const ptoGoal = access(data, 'viewer.ptoGoal');
      const retirementGoal = access(data, 'viewer.retirementGoal');

      const goalIDs = {
        TAX: access(data, 'viewer.taxGoal.id'),
        PTO: access(data, 'viewer.ptoGoal.id'),
        RETIREMENT: access(data, 'viewer.retirementGoal.id'),
      };

      const goalBalances = {
        TAX: access(data, 'viewer.taxGoal.availableBalance'),
        PTO: access(data, 'viewer.ptoGoal.availableBalance'),
        RETIREMENT: access(data, 'viewer.retirementGoal.wealthAccount.balance'),
      };

      const goalBalanceTotal = [
        access(data, 'viewer.taxGoal.availableBalance'),
        access(data, 'viewer.ptoGoal.availableBalance'),
        access(data, 'viewer.retirementGoal.wealthAccount.balance'),
      ]
        .filter(bal => !!bal)
        .reduce((prev, next) => prev + next, 0);

      // how much a user has deposited today
      const recentDeposits = access(data, 'viewer.recentDeposits');

      // how much a user is allowed to deposit today
      const depositAmountAllowed = DAILY_DEPOSIT_LIMIT - recentDeposits;
      const transferLimit =
        transferType === 'deposit'
          ? depositAmountAllowed
          : goalBalances[goalType];

      const primaryAccountRef = accountRef({
        accountName: primaryAccountName,
        accountNumber: primaryAccountNumber,
      });

      // the account to which the transfer is being sent
      const toAccount =
        transferType === 'deposit'
          ? GOAL_ACCOUNTS[goalType]
          : primaryAccountRef;

      // the account money from which the transfer orginates
      const fromAccount =
        transferType === 'deposit'
          ? primaryAccountRef
          : GOAL_ACCOUNTS[goalType];

      // find all the goals a user can withdraw from (we're not allowing retirement withdrawal at the moment)
      const goalsAvailableForWithdrawal = [
        isValidGoalForWithdrawal(taxGoal) && { ...taxGoal, goalName: 'TAX' },
        isValidGoalForWithdrawal(ptoGoal) && { ...ptoGoal, goalName: 'PTO' },
      ].filter(goal => !!goal && goal.availableBalance > 0);

      // find all the goals a user can deposit to
      const goalsAvailableForDeposit = [
        isValidGoalForDeposit(taxGoal) && { ...taxGoal, goalName: 'TAX' },
        isValidGoalForDeposit(ptoGoal) && { ...ptoGoal, goalName: 'PTO' },
        isValidGoalForDeposit(retirementGoal) &&
          wealthAccountContributions < getAnnualContributionLimit() && {
            ...retirementGoal,
            availableBalance: access(
              data,
              'viewer.retirementGoal.wealthAccount.balance',
            ),
            goalName: 'RETIREMENT',
          },
      ].filter(goal => !!goal && goal.isAccountReady);

      const goalsAvailableForTransfers =
        transferType === 'deposit'
          ? goalsAvailableForDeposit
          : goalsAvailableForWithdrawal;

      let depositValidation;

      if (transferType === 'deposit') {
        // @NOTE, we may add these scenarios back in later
        // if (transferAmount > primaryAccountBalance && recentDeposits === 0) {
        //   depositValidation = 'EXCEEDS_ACCOUNT_BALANCE';
        // } else if (transferAmount > primaryAccountBalance) {
        //   depositValidation = 'EXCEEDS_ACCOUNT_BALANCE_WITH_DEPOSITS';

        if (transferAmount > transferLimit && recentDeposits > 0) {
          depositValidation = 'EXCEEDS_DAILY_LIMIT_WITH_DEPOSITS';
        } else if (transferAmount > transferLimit && recentDeposits === 0) {
          depositValidation = 'EXCEEDS_DAILY_LIMIT';
        } else {
          depositValidation = 'OK';
        }
      }

      Log.debug(depositValidation);

      return children({
        loading,
        error,
        goalIDs,
        goalBalances,
        recentDeposits,
        toAccount,
        fromAccount,
        transferLimit,
        goalsAvailableForTransfers,
        goalBalanceTotal,
        primaryAccountBalance,
        depositValidation,
      });
    }}
  </Query>
);

TransferFundsQuery.propTypes = {
  children: PropTypes.func.isRequired,
  goalType: PropTypes.string,
  transferAmount: PropTypes.number,
  transferType: PropTypes.string,
};

export default TransferFundsQuery;
