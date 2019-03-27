import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

import { FILING_STATUS_AND_INCOME } from './UserFilingMetrics';

const Log = createLogger('update-filing-status');

// including spouse income here because they are often correlated
export const UPDATE_FILING_STATUS_INCOME = gql`
  mutation UpdateFilingStatusAndSpouseIncome(
    $filingStatusInput: FilingStatus!
    $spouseIncomeInput: SetSpouseIncomeInput!
    $userIncomeInput: SetIncomeInput!
  ) {
    setFilingStatus(input: $filingStatusInput)
    setSpouseIncome(input: $spouseIncomeInput)
    setIncome(input: $userIncomeInput) {
      estimatedIncome
    }
  }
`;

export const UpdateFilingStatusAndIncome = ({ afterComplete, children }) => {
  return (
    <Mutation
      mutation={UPDATE_FILING_STATUS_INCOME}
      onCompleted={() => afterComplete()}
      refetchQueries={[{ query: FILING_STATUS_AND_INCOME }]}
    >
      {(updateFilingStatus, { loading, error }) => {
        if (loading) Log.debug('Updating filing status');
        return children({ updateFilingStatus });
      }}
    </Mutation>
  );
};

UpdateFilingStatusAndIncome.propTypes = {
  afterComplete: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default UpdateFilingStatusAndIncome;
