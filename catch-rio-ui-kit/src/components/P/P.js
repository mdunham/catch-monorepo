import React from 'react';
import PropTypes from 'prop-types';
import Text from '../Text';

const P = ({ children, ...rest }) => (
  <Text is="p" {...rest}>
    {children}
  </Text>
);

P.propTypes = {
  children: PropTypes.node,
};

export default P;
