import React from 'react';
import Text from '../Text';
import PropTypes from 'prop-types';

const Caption = ({ children, ...rest }) => (
  <Text is="div" color="subtle" size="small" {...rest}>
    {children}
  </Text>
);

Caption.propTypes = {
  children: PropTypes.node,
};

export default Caption;
