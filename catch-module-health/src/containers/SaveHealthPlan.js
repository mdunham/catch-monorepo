import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-health-plan');

export const SAVE_HEALTH_PLAN = gql`
  mutation SaveHealthPlan($input: HealthInformationInput!) {
    upsertHealthInformation(input: $input) {
      providerPlanID
    }
  }
`;

const SaveHealthPlan = ({ children, onCompleted, planID }) => (
  <Mutation
    onCompleted={onCompleted}
    mutation={SAVE_HEALTH_PLAN}
    variables={{ input: { providerPlanID: planID } }}
  >
    {(saveHealthPlan, { loading, error, data }) => {
      if (loading) Log.debug('Saving health plan');

      return children({
        saveHealthPlan,
        loading,
      });
    }}
  </Mutation>
);

export default SaveHealthPlan;
