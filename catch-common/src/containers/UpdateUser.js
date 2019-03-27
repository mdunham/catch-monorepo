import React from 'react';
import { func } from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

import { USER_INFO } from './UserInfo';

const Log = createLogger('simple-update-user');

export const UPDATE_USER = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      id
      acknowledgedAccountDisclosures
      phoneNumber
      employment {
        occupation
      }
      residency {
        isUSCitizen
        citizenshipCountry
      }
      verticalInterest {
        healthInsuranceInterest
        retirementInterest
        lifeInsuranceInterest
      }
      trustedContact {
        name
        phoneNumber
        email
      }
      isControlPerson
      isFirmAffiliated
      isPoliticallyExposed
      subjectBackupWithholding
    }
  }
`;

export const UpdateUser = ({ children, onCompleted, refetch }) => (
  <Mutation
    mutation={UPDATE_USER}
    onCompleted={onCompleted}
    refetchQueries={refetch ? [{ query: USER_INFO }] : undefined}
  >
    {(updateUser, { loading, error }) => {
      if (loading) Log.debug('updating user data');
      return children({ updateUser, loading });
    }}
  </Mutation>
);

UpdateUser.propTypes = {
  children: func.isRequired,
  onCompleted: func,
};

export default UpdateUser;
