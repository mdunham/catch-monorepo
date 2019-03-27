import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

const Log = createLogger('update-incomeState');

export const INCOME_STATE = gql`
  mutation updateIncomeState($stateInput: SetIncomeStateInput!) {
    setIncomeState(input: $stateInput)
  }
`;

export const UpdateIncomeState = ({
  children,
  refetchQueries,
  onCompleted,
  stateInput,
}) => (
  <Mutation
    mutation={INCOME_STATE}
    refetchQueries={refetchQueries}
    onCompleted={onCompleted}
  >
    {(mutate, { loading, error }) => {
      if (loading) Log.debug('Updating income state');

      return children({
        updateIncomeState: () => mutate({ variables: { stateInput } }),
        loading,
        error,
      });
    }}
  </Mutation>
);

export default UpdateIncomeState;
