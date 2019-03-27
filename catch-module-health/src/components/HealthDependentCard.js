import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { styles as st, Icon, ReduxCheckbox, colors } from '@catch/rio-ui-kit';

const HealthDependentCard = ({
  viewport,
  title,
  children,
  onDelete,
  canDelete,
}) => (
  <View style={[styles.container, styles[`container${viewport}`]]}>
    <TouchableOpacity
      disabled={!canDelete}
      style={[styles.topActionContainer, canDelete && styles.displayAction]}
      onPress={onDelete}
    >
      <Icon
        name="close"
        size={20}
        fill="ink"
        dynamicRules={{ paths: { fill: colors.ink } }}
      />
    </TouchableOpacity>
    <Text style={st.get(['H4', 'BottomGutter'], viewport)}>{title}</Text>
    <View style={styles.rule} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
    width: '100%',
    maxWidth: 300,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors['sage'],
    marginBottom: 16,
    borderRadius: 6,
    overflow: 'hidden',
  },
  containerPhoneOnly: {
    maxWidth: '100%',
  },
  rule: {
    height: 2,
    width: 48,
    backgroundColor: colors['sage'],
    marginBottom: 12,
  },
  topActionContainer: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginRight: -8,
    opacity: 0,
  },
  displayAction: {
    opacity: 1,
  },
});

export default HealthDependentCard;
