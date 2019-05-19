import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';

import { styles as st, colors, InfoTooltip } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

const PlanSavingsCard = ({ viewport, amount }) => (
  <View style={styles.container}>
    <View style={styles.tooltip}>
      <InfoTooltip body="TODO" />
    </View>
    <Text style={st.get(['H1', 'Success'], viewport)}>
      <Currency whole>{amount}</Currency>
    </Text>
    <Text style={st.get('Body', viewport)}>in monthly savings</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 33,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors['sage'],
    alignItems: 'center',
    borderRadius: 6,
    width: '100%',
    maxWidth: 327,
    marginBottom: 40,
  },
  tooltip: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
    // TODO
    display: 'none',
  },
});

export default PlanSavingsCard;
