import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Button, Box, colors, shadow, Icon } from '@catch/rio-ui-kit';

const styles = StyleSheet.create({
  base: {
    top: 20,
    left: 20,
    zIndex: 100,
    padding: 11,
    position: 'absolute',
  },
});

const BackButton = ({ onClick }) => (
  <TouchableOpacity onPress={onClick} style={styles.base}>
    <Icon
      name="left"
      size={18.67}
      dynamicRules={{ paths: { fill: colors.ink } }}
      fill={colors.ink}
      stroke={colors.ink}
    />
  </TouchableOpacity>
);

export default BackButton;
