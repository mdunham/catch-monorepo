import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

const Log = createLogger('update-filingStatus');

export const UPDATE_FILING_STATUS = gql`
  mutation updateFilingStatus(
    $filingStatus: FilingStatus!
    $spouseIncome: SetSpouseIncomeInput!
  ) {
    setFilingStatus(input: $filingStatus)
    setSpouseIncome(input: $spouseIncome)
  }
`;

export const UpdateFilingStatus = ({
  children,
  refetchQueries,
  onCompleted,
  filingStatus,
  spouseIncome,
}) => (
  <Mutation
    mutation={UPDATE_FILING_STATUS}
    refetchQueries={refetchQueries}
    onCompleted={onCompleted}
  >
    {(mutate, { loading, error }) => {
      if (loading) Log.debug('Updating filingStatus');

      return children({
        updateFilingStatus: () =>
          mutate({ variables: { filingStatus, spouseIncome } }),
        loading,
        error,
      });
    }}
  </Mutation>
);

export default UpdateFilingStatus;
