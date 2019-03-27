import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

import { HOME_STATUS } from './HomeStatus';

const Log = createLogger('save-enrollment');

export const SAVE_ENROLLMENT = gql`
  mutation SaveEnrollment(
    $enrollment: HealthInformationInput!
    $source: HealthInsuranceInput!
  ) {
    upsertHealthInformation(input: $enrollment) {
      didEnroll
    }
    upsertHealthInsurance(input: $source) {
      insuranceSource
      id
    }
  }
`;

function updateEnrollment(
  cache,
  {
    data: {
      upsertHealthInformation: { didEnroll },
    },
  },
) {
  const { viewer } = cache.readQuery({
    query: HOME_STATUS,
    variables: {
      incomeAction: ['USER_PENDING', 'SKIPPED', 'APPROVED'],
      rewardStatus: 'INITIAL',
    },
  });

  cache.writeQuery({
    query: HOME_STATUS,
    data: {
      viewer: {
        ...viewer,
        health: {
          ...viewer.health,
          information: {
            ...viewer.health.information,
            didEnroll,
          },
        },
      },
    },
  });
}

const SaveEnrollment = ({ children, onCompleted, isTest }) => (
  <Mutation
    mutation={SAVE_ENROLLMENT}
    update={isTest ? undefined : updateEnrollment}
    onCompleted={onCompleted}
  >
    {(saveEnrollment, { loading, error, data }) => {
      if (loading) Log.debug('Saving enrollment');

      return children({
        loading,
        saveEnrollment,
      });
    }}
  </Mutation>
);

SaveEnrollment.propTypes = {
  children: PropTypes.func,
  onCompleted: PropTypes.func,
};

export default SaveEnrollment;
