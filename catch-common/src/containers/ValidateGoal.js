import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('validate-goal');

export const VALIDATE_GOAL = gql`
  query ValidateGoal($percentage: Float!, $id: ID!) {
    viewer {
      validateGoal(incomePercentage: $percentage, id: $id) {
        isValid
        errorMessage
        totalPercentage
      }
    }
  }
`;

const ValidateGoal = ({ children, id, percentage }) => (
  <Query query={VALIDATE_GOAL} variables={{ id, percentage }}>
    {({ loading, error, data, refetch }) => {
      const totalPercentage = access(
        data,
        'viewer.validateGoal.totalPercentage',
      );

      const validationError = access(data, 'viewer.validateGoal.errorMessage');

      Log.debug(validationError);

      return children({
        loading,
        error,
        validationError,
      });
    }}
  </Query>
);

export default ValidateGoal;
