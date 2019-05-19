import React from 'react';
import { func } from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';
import UpdateUser from './UpdateUser';
import UpdateSSN from './UpdateSSN';
import UpdateLegalAddress from './UpdateLegalAddress';
import CheckKYC from './CheckKYC';
import ValidateSSN from './ValidateSSN';

const Log = createLogger('save-legal-form');

export const SaveLegalForm = ({ children, onCompleted, refetch }) => (
  <ValidateSSN>
    {({ validateSSN, validating }) => (
      <UpdateUser>
        {({ updateUser, loading: updatingUser }) => (
          <UpdateSSN>
            {({ updateSSN, loading: updatingSSN }) => (
              <CheckKYC>
                {({ checkKYC, loading: checkingKYC }) => (
                  <UpdateLegalAddress>
                    {({ updateLegalAddress, loading: updatingAddress }) => {
                      return children({
                        updateUser,
                        updateSSN,
                        updateLegalAddress,
                        checkKYC,
                        validateSSN,
                        validatingSSN: validating,
                        updating:
                          updatingUser ||
                          updatingSSN ||
                          updatingAddress ||
                          checkingKYC,
                      });
                    }}
                  </UpdateLegalAddress>
                )}
              </CheckKYC>
            )}
          </UpdateSSN>
        )}
      </UpdateUser>
    )}
  </ValidateSSN>
);

SaveLegalForm.propTypes = {
  children: func.isRequired,
  onCompleted: func,
};

export default SaveLegalForm;
