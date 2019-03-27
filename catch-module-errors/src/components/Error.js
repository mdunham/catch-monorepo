import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isObject } from 'lodash';

import { Placeholder } from '@catch/rio-ui-kit';

const Error = ({ children, ...other }) => (
  <Placeholder color="error" {...other}>
    {isObject(children) ? JSON.stringify(children) : children}
  </Placeholder>
);

Error.propTypes = {
  children: PropTypes.node,
};

export default Error;
