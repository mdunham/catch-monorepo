import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

import { USER_INFO } from './UserInfo';

import { postToHubspot } from '../analytics';

const WORK_TYPES = {
  WORK_TYPE_W2: '_full_time_employee',
  WORK_TYPE_1099: 'freelancer/contractor',
  WORK_TYPE_DIVERSIFIED: 'mixed_job_types',
};

const Log = createLogger('update-user-metadata');

export const UPDATE_USER_METADATA = gql`
  mutation UpdateUserMetadata(
    $userIncome: SetIncomeInput!
    $spouseIncome: SetSpouseIncomeInput!
    $stateInput: SetIncomeStateInput!
    $filingStatus: FilingStatus!
    $userMetadata: UpdateUserInput! #occupation
  ) {
    setIncome(input: $userIncome) {
      estimatedIncome
      estimated1099Income
      estimatedW2Income
    }
    setSpouseIncome(input: $spouseIncome)
    setIncomeState(input: $stateInput)
    setFilingStatus(input: $filingStatus)
    updateUser(input: $userMetadata) {
      id
      workType
      employment {
        occupation
      }
    }
  }
`;

const handleCompletion = (onCompleted, data) => {
  postToHubspot({
    payload: [
      {
        property: 'employment_status',
        value: WORK_TYPES[data.updateUser.workType],
      },
    ],
  });
  onCompleted(data);
};

export const UpdateUserMetaData = ({ children, onCompleted }) => (
  <Mutation
    mutation={UPDATE_USER_METADATA}
    onCompleted={data => handleCompletion(onCompleted, data)}
    refetchQueries={[{ query: USER_INFO }]}
  >
    {(updateUserMetadata, { loading, error }) => {
      if (loading) Log.debug('updating user metadata');

      return children({ loading, updateUserMetadata });
    }}
  </Mutation>
);

UpdateUserMetaData.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UpdateUserMetaData;
