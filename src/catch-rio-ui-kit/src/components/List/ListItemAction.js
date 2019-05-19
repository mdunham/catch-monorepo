import React from 'react';
import PropTypes from 'prop-types';

import Box from '../Box';
/**
 * _ListItemAction allows to add Action Components after some list item.
 * This is a web version in case some environment doesn't allow
 * composite components. Use carefully.
 */
// export const _ListItemAction = ({ children, ...other }) => (
//   <div {...other}>{children}</div>
// );

/**
 * ListItemAction is a wrapper for CTA's in a list item
 */
const ListItemAction = ({ children, ...other }) => (
  <Box {...other}>{children}</Box>
);

export default ListItemAction;
