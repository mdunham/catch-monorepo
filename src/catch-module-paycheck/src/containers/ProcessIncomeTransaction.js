import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('process-income');

export const PROCESS_INCOME = gql`
  mutation ApproveIncomeTransaction($incomeInput: ApproveIncomeInput!) {
    approveIncomeTransaction(input: $incomeInput) {
      id
      status
    }
  }
`;

const ProcessIncomeTransaction = ({
  children,
  onCompleted,
  refetchQueries,
  goalApprovals,
  id,
}) => (
  <Mutation
    mutation={PROCESS_INCOME}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
  >
    {(mutate, { loading, error, data }) => {
      return children({
        process: mutate,
        result: data,
        loading,
        error,
      });
    }}
  </Mutation>
);

export default ProcessIncomeTransaction;
