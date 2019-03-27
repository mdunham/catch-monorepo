import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, Checkbox, Slider } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

const PREFIX = 'catch.health.PremiumFilterCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  caption: values => (
    <FormattedMessage id={`${PREFIX}.caption`} values={values} />
  ),
};

const PremiumFilterCard = ({
  viewport,
  filters,
  onFilterChange,
  maxPremium,
  minPremium,
}) => (
  <View onStartShouldSetResponder={() => true} style={styles.container}>
    <Text style={st.get(['FinePrint', 'SmBottomGutter', 'Bold'], viewport)}>
      {COPY['title']}
    </Text>
    {viewport !== 'TabletPortraitUp' && (
      <Text style={st.get(['FinePrint'], viewport)}>{COPY['description']}</Text>
    )}
    <Text style={st.get(['Body', 'BottomGutter', 'TopGutter'], viewport)}>
      {COPY['caption']({
        amount: (
          <Text style={st.get(['Body', 'Bold'], viewport)}>
            <Currency whole>{filters['premium'] || maxPremium}</Currency>
          </Text>
        ),
      })}
    </Text>
    <Slider
      min={0}
      value={filters['premium'] || maxPremium}
      max={maxPremium}
      onChange={val => onFilterChange('premium', val)}
    />
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
});

export default PremiumFilterCard;
