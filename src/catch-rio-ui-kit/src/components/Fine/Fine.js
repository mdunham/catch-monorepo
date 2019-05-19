import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Text';
import { colors } from '../../const';

const Fine = ({
  children,
  link,
  color = link ? 'link' : 'gray3',
  size = 13,
  weight = link ? 'medium' : 'normal',
  ...rest
}) => (
  <Text color={color} size={size} weight={weight} {...rest}>
    {children}
  </Text>
);

Fine.propTypes = {
  children: PropTypes.node,
};

export default Fine;
