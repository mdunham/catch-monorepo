import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, colors, Checkbox } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.NetworkFilterCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

const NetworkFilterCard = ({ viewport, filters, onFilterChange }) => (
  <View
    onStartShouldSetResponder={() => true}
    style={[styles.container, styles[`container${viewport}`]]}
  >
    <Text style={st.get(['FinePrint', 'SmBottomGutter', 'Bold'], viewport)}>
      {COPY['title']}
    </Text>
    {viewport !== 'TabletPortraitUp' && (
      <Text style={st.get(['FinePrint'], viewport)}>{COPY['description']}</Text>
    )}
    <View
      style={st.get([
        'Row',
        'Wrap',
        'TopGutter',
        viewport === 'PhoneOnly' && styles.divider,
      ])}
    >
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['hmo']}
          onChange={() => onFilterChange('hmo', !filters['hmo'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>HMO</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['epo']}
          onChange={() => onFilterChange('epo', !filters['epo'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>EPO</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['ppo']}
          onChange={() => onFilterChange('ppo', !filters['ppo'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>PPO</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    paddingVertical: 8,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: colors['sage+1'],
    paddingBottom: 24,
  },
  containerPhoneOnly: {
    paddingBottom: 0,
  },
});

export default NetworkFilterCard;
