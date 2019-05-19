import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { colors } from '../../const';
import Box from '../Box';

/**
 * Divider is useful for separating different concerns on a view
 * @NOTE 100% height does not always work so we add height (or width) props
 */
const Divider = ({
  white,
  short,
  tiny,
  vertical,
  height,
  width,
  style,
  color,
  ...rest
}) => (
  <Box
    style={[
      styles.base,
      vertical && styles.vertical,
      short && styles.short,
      tiny && styles.tiny,
      white && { backgroundColor: colors.white, opacity: 0.25 },
      color && { backgroundColor: color },
      !!height && { height },
      !!width && { width },
      style,
    ]}
    {...rest}
  />
);

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.fog,
    opacity: 0.5,
    height: 1,
    width: '100%',
  },
  vertical: {
    height: '100%',
    width: 1,
  },
  short: {
    width: '50%',
    margin: 'auto',
    alignSelf: 'center',
  },
  tiny: {
    width: '25%',
    margin: 'auto',
  },
});

export default Divider;
