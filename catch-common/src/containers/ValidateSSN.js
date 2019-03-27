/**
 * ValidateSSN
 *
 * This mutation checks our db to see if the SSN is valid and NOT duplicate
 *
 * A TRUE response means that the SSN the user entered is unique
 * A FALSE response means that the SSN is a duplicate
 *
 * To test for duplicate SSNs, use 123-45-6789 in non-prod environments. This SSN will always return FALSE
 */

import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';

const Log = createLogger('validate-ssn');

export const VALIDATE_SSN = gql`
  mutation ValidateSSN($input: ValidateSSNInput!) {
    validateSSN(input: $input)
  }
`;

export const ValidateSSN = ({ children, onCompleted }) => (
  <Mutation mutation={VALIDATE_SSN} onCompleted={onCompleted}>
    {(validateSSN, { loading, error }) => {
      if (loading) Log.debug('checking for duplicate ssn');
      return children({ validateSSN, validating: loading, error });
    }}
  </Mutation>
);

ValidateSSN.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default ValidateSSN;
