import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { styles as st } from '@catch/rio-ui-kit';

const HealthMetalFlag = ({ level, viewport, style }) => (
  <View style={styles.container}>
    <View style={[styles.badge, styles[`badge${level}`]]} />
    <Text
      style={st.get(
        ['H6', 'Bold', 'SmLeftGutter', styles[`text${level}`]],
        viewport,
      )}
    >
      {(level || '').toUpperCase()}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    height: 12,
    width: 12,
    borderRadius: 12,
  },
  badgeCatastrophic: {
    backgroundColor: '#FE7F7B',
  },
  textCatastrophic: {
    color: '#AD3C39',
  },
  badgePlatinum: {
    backgroundColor: '#DCDAED',
  },
  textPlatinum: {
    color: '#76748F',
  },
  badgeGold: {
    backgroundColor: '#F7C96D',
  },
  textGold: {
    color: '#A66A00',
  },
  badgeSilver: {
    backgroundColor: '#D9D9DB',
  },
  textSilver: {
    color: '#5A6172',
  },
  badgeBronze: {
    backgroundColor: '#D4A892',
  },
  textBronze: {
    color: '#733509',
  },
});

export default HealthMetalFlag;
