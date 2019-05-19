import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { accountRef, createLogger } from '@catch/utils';

const Log = createLogger('transaction-receipt');

export const TRANSACTION_RECEIPT = gql`
  query TransactionReceipt($id: ID!, $pagination: Pagination!) {
    viewer {
      incomeTransaction(id: $id) {
        id
        amount
        description
        status
        transferAmount
        paycheckType
        goalBreakdowns {
          id
          amount
          goalID
          description
          percentage
          status
          type
        }
        date
        account {
          id
          name
          accountNumber
          bankLink {
            id
            bank {
              id
              name
            }
          }
        }
      }
      deposits: transfers(pagination: $pagination, direction: DEPOSIT) {
        edges {
          id
          amount
          createdOn
          completionDate
          transactions {
            id
            expectedDate
            completionDate
            goalType
            isPending
          }
        }
      }
    }
  }
`;

const TransactionReceipt = ({ children, id, goalType }) => (
  <Query
    query={TRANSACTION_RECEIPT}
    variables={{ id, pagination: { pageNumber: 1, pageSize: 20 } }}
  >
    {({ data, loading, error }) => {
      if (error) Log.error(error);

      const paycheckID = access(data, 'viewer.incomeTransaction.id');
      const paycheckType = access(
        data,
        'viewer.incomeTransaction.paycheckType',
      );

      // Temporary reduce the size of the ugly uid
      const shortID = paycheckID ? paycheckID.slice(0, 8) : undefined;

      // It would be nice if the createdOn date for an income transaction was directly on said income transaction. Since it's not, we have to iterate through the list of deposits and key off the paycheckID
      const deposits = access(data, 'viewer.deposits.edges');
      const deposit = !!deposits && deposits.find(d => d.id === paycheckID);
      const createdOn = !!deposit && deposit.createdOn;

      const completionDate = access(deposit, 'completionDate');

      // get all transactions for a deposit
      const transactions = !!deposit && deposit.transactions;

      // find the savings account transaction
      const savingsTransactions =
        !!transactions &&
        transactions.filter(
          tx => tx.goalType === 'TAX' || tx.goalType === 'PTO',
        );

      // the expected date the savings transfer should be completed
      const savingsExpectedDate =
        Array.isArray(savingsTransactions) &&
        savingsTransactions[0].expectedDate;

      // the date the savings transfer completed
      const savingsCompletionDate = !!(
        Array.isArray(savingsTransactions) &&
        savingsTransactions[0].completionDate
      )
        ? savingsTransactions[0].completionDate
        : completionDate; // use the transfer completion date if the transaction completion is not available

      // the status of the savings account transaction
      const savingsTransactionIsPending =
        Array.isArray(savingsTransactions) && savingsTransactions[0].isPending;

      // find the wealth account transaction
      const wealthTransaction =
        !!transactions && transactions.find(tx => tx.goalType === 'RETIREMENT');

      // the expected date the wealth transfer should be completed
      const wealthExpectedDate =
        !!wealthTransaction && wealthTransaction.expectedDate;

      // the date the retirement transfer was invested in Folio
      const wealthCompletionDate = !!(
        wealthTransaction && wealthTransaction.completionDate
      )
        ? wealthTransaction.completionDate
        : completionDate;

      // the status of the wealth account transaction
      const wealthTransactionIsPending =
        !!wealthTransaction && wealthTransaction.isPending;

      let status = access(data, 'viewer.incomeTransaction.status');

      status = goalType
        ? goalType === 'retirement'
          ? wealthTransactionIsPending
            ? 'PROCESSING'
            : status
          : status
        : status;

      const paycheckAmount = access(data, 'viewer.incomeTransaction.amount');

      const bankName = access(
        data,
        'viewer.incomeTransaction.account.bankLink.bank.name',
      );
      const accountNumber = access(
        data,
        'viewer.incomeTransaction.account.accountNumber',
      );
      const accountName = access(data, 'viewer.incomeTransaction.account.name');
      const account = accountRef({ bankName, accountName, accountNumber });

      const date = access(data, 'viewer.incomeTransaction.date');
      const allBreakdowns =
        access(data, 'viewer.incomeTransaction.goalBreakdowns') || [];
      const total = access(data, 'viewer.incomeTransaction.transferAmount');

      // remove any skipped income transactions from breakdown
      const filteredBreakdowns = allBreakdowns.filter(
        bd =>
          bd.status !== 'INCOME_ACTION_SKIPPED' &&
          bd.status !== 'INCOME_ACTION_USER_PENDING',
      );

      const goalBreakdowns = allBreakdowns.filter(
        bd => bd.type.toLowerCase() === goalType,
      );

      const breakdowns = goalType ? goalBreakdowns : filteredBreakdowns;

      const savingsBreakdowns = breakdowns.filter(
        bd => bd.type === 'TAX' || bd.type === 'PTO',
      );
      const investmentBreakdowns = breakdowns.filter(
        bd => bd.type === 'RETIREMENT',
      );

      const viewTotal = goalType
        ? breakdowns.length
          ? goalBreakdowns[0].amount
          : null
        : total;

      return children({
        loading,
        error,
        status,
        paycheckID: shortID,
        paycheckAmount,
        account,
        date,
        // keep using breakdowns for withdrawals (not yet processing investment withdrawals)
        breakdowns,
        savingsBreakdowns,
        investmentBreakdowns,
        total: viewTotal,
        createdOn,
        savingsExpectedDate,
        savingsTransactionIsPending,
        wealthExpectedDate,
        wealthTransactionIsPending,
        completionDate,
        paycheckType,
        savingsCompletionDate,
        wealthCompletionDate,
      });
    }}
  </Query>
);

TransactionReceipt.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  goalType: PropTypes.string,
};

export default TransactionReceipt;
