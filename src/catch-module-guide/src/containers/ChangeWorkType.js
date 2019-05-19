import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('change-workType');

export const CHANGE_WORKTYPE = gql`
  mutation ChangeWorkType(
    $userIncome: SetIncomeInput!
    $userMetadata: UpdateUserInput! #workType
  ) {
    setIncome(input: $userIncome) {
      estimated1099Income
      estimatedW2Income
    }
    updateUser(input: $userMetadata) {
      id
      workType
    }
  }
`;

export const ChangeWorkType = ({ children, onCompleted, refetchQueries }) => (
  <Mutation
    mutation={CHANGE_WORKTYPE}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
  >
    {(updateWorkType, { loading, error }) => {
      if (loading) Log.debug('updating workType');

      return children({ loading, updateWorkType });
    }}
  </Mutation>
);

ChangeWorkType.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  refetchQueries: PropTypes.array,
};

export default ChangeWorkType;
