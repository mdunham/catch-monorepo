import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

import { FILING_STATUS_AND_INCOME } from './UserFilingMetrics';

const Log = createLogger('update-income');

export const UPDATE_SPOUSE_INCOME = gql`
  mutation UpdateIncome($input: SetIncomeInput!) {
    setSpouseIncome(input: $input)
  }
`;

export const UpdateSpouseIncome = ({ afterComplete, children }) => {
  return (
    <Mutation
      mutation={UPDATE_SPOUSE_INCOME}
      onCompleted={() => afterComplete()}
      refetchQueries={[{ query: FILING_STATUS_AND_INCOME }]}
    >
      {(updateSpouseIncome, { loading, error }) => {
        if (loading) Log.debug('updating estimated income');
        return children({ updateSpouseIncome });
      }}
    </Mutation>
  );
};

UpdateSpouseIncome.propTypes = {
  afterComplete: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
};

export default connect(undefined, toastActions)(UpdateSpouseIncome);
