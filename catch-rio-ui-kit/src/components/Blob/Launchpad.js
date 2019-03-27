import React from 'react';
import { View, StyleSheet } from 'react-native';

import Figure from '../Figure';

const Launchpad = ({ children, style }) => (
  <View style={[styles.container, style]}>
    <View style={styles.frame}>
      <Figure name="blob-frame" />
    </View>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    height: 229,
    width: 229,
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});

export default Launchpad;
