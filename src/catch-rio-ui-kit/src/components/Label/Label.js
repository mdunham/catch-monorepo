import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import Text from '../Text';

const Label = ({ children, ...rest }) => (
  <Text
    size={14}
    is="label"
    weight="medium"
    color="ink"
    role={Platform.select({ web: 'label' })}
    {...rest}
  >
    {children}
  </Text>
);

Label.propTypes = {
  children: PropTypes.node,
};

export default Label;
