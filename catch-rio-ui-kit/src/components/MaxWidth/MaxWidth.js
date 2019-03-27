import React from 'react';
import PropTypes from 'prop-types';

import Box from '../Box';

const MaxWidth = ({ mw, children }) => (
  <Box style={{ maxWidth: mw }}>{children}</Box>
);

MaxWidth.propTypes = {
  mw: PropTypes.number,
  children: PropTypes.node,
};

MaxWidth.defaultProps = {
  // Defaults as mobile device width
  mw: 375,
};

export default MaxWidth;
