import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';

import { styles as st, colors } from '@catch/rio-ui-kit';
import { formatDependents } from '../utils';

import HealthMetalFlag from './HealthMetalFlag';

const HealthPlanMiniCard = ({
  viewport,
  metalLevel,
  dependents,
  planType,
  provider,
  planName,
  onPress,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!onPress}
    style={st.get(['Card', styles.container, styles[`container${viewport}`]])}
  >
    <View style={st.get(['Bilateral', 'SmBottomGutter'])}>
      <HealthMetalFlag level={metalLevel} viewport={viewport} />
      <Text style={st.get(['H6', 'Bold'], viewport)}>{planType}</Text>
    </View>
    <Text style={st.get(['Body', 'Bold', 'SmBottomGutter'], viewport)}>
      {provider}
    </Text>
    <Text style={st.get(['FinePrint', 'SubtleText'], viewport)}>
      {planName}
    </Text>
    {Array.isArray(dependents) && (
      <View style={styles.footer}>
        <Text style={st.get(['FinePrint'], viewport)}>
          {formatDependents(dependents)}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: 343,
    marginBottom: 32,
  },
  containerPhoneOnly: {
    width: '100%',
  },
  footer: {
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: colors['sage+1'],
    marginTop: 16,
    marginBottom: 8,
  },
});

export default HealthPlanMiniCard;
