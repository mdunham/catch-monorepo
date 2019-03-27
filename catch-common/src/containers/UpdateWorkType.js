import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { USER_INFO } from '@catch/common';

export const UPDATE_WORKTYPE = gql`
  mutation UpdateWorkType($userWorkTypeInput: UpdateUserInput!) {
    updateUser(input: $userWorkTypeInput) {
      workType
    }
  }
`;

const UpdateWorkType = ({ onCompleted, children, refetch }) => (
  <Mutation
    mutation={UPDATE_WORKTYPE}
    onCompleted={onCompleted}
    refetchQueries={refetch ? [{ query: USER_INFO }] : undefined}
  >
    {(mutateWorkType, { loading, error, data }) => {
      const workType = access(data, 'updateUser.workType');

      return children({
        mutateWorkType,
        loading,
        error,
        workType,
      });
    }}
  </Mutation>
);

UpdateWorkType.propTypes = {
  onCompleted: PropTypes.func,
  children: PropTypes.func.isRequired,
  refetch: PropTypes.bool,
};

export default UpdateWorkType;
