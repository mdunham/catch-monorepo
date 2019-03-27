import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';

const InputError = ({ children, ...rest }) => (
  <Text color="error" size="small" {...rest}>
    {children}
  </Text>
);

InputError.propTypes = {
  children: PropTypes.node,
};

export default InputError;
