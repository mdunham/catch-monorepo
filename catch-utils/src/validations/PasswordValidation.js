import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

import Env from '../env';
import { Box, colors } from '@catch/rio-ui-kit';

import PasswordRequirement from './PasswordRequirement';

//@TODO maybe move these functions to util-format

// The string must be at least 8 letters long
export const testLength = (value = '') => {
  if (value) {
    return value.length >= 8;
  }
  return false;
};

// The string must contain at least 1 lowercase alphabetical character
export const testLowerCase = (value = '') => {
  return /(?=.*[a-z])/.test(value);
};

// The string must contain at least 1 uppercase alphabetical character
export const testUpperCase = (value = '') => {
  return /(?=.*[A-Z])/.test(value);
};

// The string must contain at least 1 numeric character
export const testNumber = (value = '') => {
  return /(?=.*[0-9])/.test(value);
};

// The string must contain at least 1 special character
export const testSymbol = (value = '') => {
  if (!/[\s]/.test(value) && value) {
    return /(?=.*\W)/.test(value);
  }
};

export const isValidPassword = (value = '') => {
  if (Env.isProd || Env.isStage) {
    return (
      !!testSymbol(value) &&
      !!testLowerCase(value) &&
      !!testNumber(value) &&
      !!testUpperCase(value) &&
      !!testLength(value)
    );
  } else {
    return value.length >= 6;
  }
};

export const PasswordValidation = ({ password }) => (
  <Box style={{ backgroundColor: colors.white }}>
    <PasswordRequirement
      description="8 or more characters"
      isValid={testLength(password)}
    />
    <PasswordRequirement
      description="Capital letter"
      isValid={testUpperCase(password)}
    />
    <PasswordRequirement
      description="Lowercase letter"
      isValid={testLowerCase(password)}
    />
    <PasswordRequirement description="Number" isValid={testNumber(password)} />
    <PasswordRequirement
      description="Symbol/special character"
      isValid={testSymbol(password)}
    />
  </Box>
);

PasswordValidation.propTypes = {
  password: PropTypes.string,
};

export default connect((state, ownProps) => ({
  password: formValueSelector(ownProps.formName)(state, ownProps.fieldName),
}))(PasswordValidation);
