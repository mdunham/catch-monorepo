import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';

// use this for empty states, errors, etc. to be consistent
const Placeholder = ({ children, ...rest }) => (
  <Text size="large" weight="medium" color="gray4" {...rest}>
    {children}
  </Text>
);

Placeholder.propTypes = {
  children: PropTypes.node,
};

export default Placeholder;
