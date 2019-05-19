import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';

import Text from '../Text';
import Box from '../Box';
import { borderRadius, colors, fontColors } from '../../const';

/**
 * Renamed based on design semantics.
 * Flag grabs a user's attention about a component's specific state
 * @NOTE the box container is required by ios to give the proper border radius
 * appearance. Might be a RN bug...
 */
const Flag = ({
  children,
  type,
  color,
  style,
  size,
  rounded,
  weight,
  ...other
}) => (
  <Box
    style={[styles.container, rounded && styles.roundedContainer]}
    {...other}
  >
    <Text
      size={size}
      spacing={0.5}
      weight={weight}
      style={[styles.base, styles[type], style]}
    >
      {!!children && children.toUpperCase()}
    </Text>
  </Box>
);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 4,
    alignSelf: 'baseline',
  },
  roundedContainer: {
    borderRadius: 999,
  },
  // @TODO: better organize this
  outline: {
    overflow: 'hidden',
    borderRadius: 999,
    borderColor: colors.grass,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  base: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: colors.primary,
    color: fontColors.white,
  },
  primary: {
    backgroundColor: colors['flare+3'],
    color: colors['flare'],
  },
  // Both are the same but don't want to break things
  recommended: {
    backgroundColor: colors['algae+3'],
    color: colors['algae-1'],
  },
  paused: {
    backgroundColor: colors['ink+4'],
    color: colors['ink+1'],
  },
  percentage: {
    backgroundColor: colors['sage+1'],
    color: colors['ink'],
  },
  dayoff: {
    backgroundColor: colors['peach+1'],
    color: colors['ink'],
  },
  // Deprecated
  active: {
    backgroundColor: colors['algae+3'],
    color: colors['algae-1'],
  },
  warning: {
    backgroundColor: '#FFB73B',
    color: '#8C6520',
  },
  danger: {
    backgroundColor: '#FF605B',
    color: '#80312E',
  },
  inactive: {
    backgroundColor: colors['ink+4'],
    color: colors['ink+1'],
  },
  comingSoon: {
    backgroundColor: colors['flare+3'],
    color: colors['flare-2'],
  },
});

Flag.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.string,
};

Flag.defaultProps = {
  type: 'active',
  size: 10,
  weight: 'bold',
};

export default Flag;
