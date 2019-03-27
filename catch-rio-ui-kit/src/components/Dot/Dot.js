import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform } from 'react-native';

import { colors } from '../../const';
import Box from '../Box';

const styles = StyleSheet.create({
  base: {
    borderRadius: Platform.select({ web: '50%', default: 3 }),
    height: 6,
    width: 6,
    // margin: 3,
  },
  error: {
    backgroundColor: colors.coral,
  },
  warning: {
    backgroundColor: colors.peach,
  },
  success: {
    backgroundColor: colors.algae,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  subtle: {
    backgroundColor: colors['ink+1'],
  },
});

const Dot = ({ size, color, ...other }) => (
  <Box
    style={[
      styles.base,
      size && { width: size, height: size },
      color && (styles[color] || { backgroundColor: color }),
    ]}
    {...other}
  />
);

export default Dot;
