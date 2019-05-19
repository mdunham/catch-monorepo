import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('save-exit-stage');

export const SAVE_EXIT_STAGE = gql`
  mutation SaveExitStage($input: HealthInformationInput!) {
    upsertHealthInformation(input: $input) {
      didEnroll
      exitStage
    }
  }
`;

/**
 * Each time we save a new enrollment we reset the didEnroll
 * flag to null
 */
const SaveExitStage = ({ children, onCompleted, stage }) => (
  <Mutation
    mutation={SAVE_EXIT_STAGE}
    onCompleted={onCompleted}
    variables={{ input: { exitStage: stage, didEnroll: 'NIL' } }}
  >
    {(saveExitStage, { loading, error, data }) => {
      if (loading) Log.debug('Saving exit stage');

      return children({
        loading,
        saveExitStage,
      });
    }}
  </Mutation>
);

SaveExitStage.propTypes = {
  children: PropTypes.func,
  onCompleted: PropTypes.func,
  stage: PropTypes.oneOf([
    'STATE_EXCHANGE',
    'MEDICARE',
    'MEDICAID',
    'HEALTHCARE_GOV',
  ]),
};

export default SaveExitStage;
