import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

import { FILING_STATUS_AND_INCOME } from './UserFilingMetrics';

const Log = createLogger('update-income');

export const UPDATE_INCOME = gql`
  mutation UpdateIncome($input: SetIncomeInput!) {
    setIncome(input: $input) {
      estimatedIncome
      estimated1099Income
      estimatedW2Income
    }
  }
`;

export const UpdateIncome = ({ onCompleted, children, refetchQueries }) => {
  return (
    <Mutation
      mutation={UPDATE_INCOME}
      onCompleted={onCompleted}
      refetchQueries={refetchQueries || [{ query: FILING_STATUS_AND_INCOME }]}
    >
      {(updateIncome, { loading, error }) => {
        if (loading) Log.debug('updating estimated income');
        return children({ updateIncome });
      }}
    </Mutation>
  );
};

UpdateIncome.propTypes = {
  onCompleted: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default UpdateIncome;
