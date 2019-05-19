import React from 'react';
import PropTypes from 'prop-types';
import Box from './Box';

const Flex = ({ children, ...other }) => <Box {...other}>{children}</Box>;

Flex.propTypes = {
  children: PropTypes.node,
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

export default Flex;
