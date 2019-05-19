import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';
import differenceInHours from 'date-fns/difference_in_hours';

import { createLogger } from '@catch/utils';

const Log = createLogger('income-transaction');

export const INCOME_TRANSACTION = gql`
  query GetIncomeTransaction($id: ID!) {
    viewer {
      user {
        id
        workType
      }
      primaryBankLink {
        id
        syncStatus
        bank {
          id
          name
        }
      }
      incomeTransaction(id: $id) {
        id
        amount
        transferAmount
        description
        status
        date
        actedOn
      }
    }
  }
`;

const IncomeTransaction = ({ children, id }) => (
  <Query query={INCOME_TRANSACTION} variables={{ id }}>
    {({ loading, error, data }) => {
      Log.debug(data);
      const amount = access(data, 'viewer.incomeTransaction.amount');
      const description = access(data, 'viewer.incomeTransaction.description');
      const date = access(data, 'viewer.incomeTransaction.date');
      const transferAmount = access(
        data,
        'viewer.incomeTransaction.transferAmount',
      );
      const workType = access(data, 'viewer.user.workType');
      const syncStatus = access(data, 'viewer.primaryBankLink.syncStatus');
      const bankName = access(data, 'viewer.primaryBankLink.bank.name');
      const actedOn = access(data, 'viewer.incomeTransaction.actedOn');
      const txStatus = access(data, 'viewer.incomeTransaction.status');

      return children({
        loading,
        error,
        amount,
        description,
        date,
        transferAmount, // The actual amount we take
        workType,
        syncStatus,
        bankName,
        actedOn,
        txStatus,
      });
    }}
  </Query>
);

export default IncomeTransaction;
