import React from 'react';
import PropTypes from 'prop-types';
import { H3 } from '../Headings';

/**
 * ModalTitle provides some sane default padding
 */
const ModalTitle = ({ children, ...other }) => (
  <H3 weight="bold" {...other}>
    {children}
  </H3>
);

export default ModalTitle;
