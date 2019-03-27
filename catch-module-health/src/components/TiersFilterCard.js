import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, colors, Checkbox } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.TiersFilterCard';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

const TiersFilterCard = ({ viewport, filters, onFilterChange }) => (
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
          checked={filters['catastrophic']}
          onChange={() =>
            onFilterChange('catastrophic', !filters['catastrophic'])
          }
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>
          Catastrophic
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['bronze']}
          onChange={() => onFilterChange('bronze', !filters['bronze'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>
          Bronze
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['silver']}
          onChange={() => onFilterChange('silver', !filters['silver'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>
          Silver
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['gold']}
          onChange={() => onFilterChange('gold', !filters['gold'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>
          Gold
        </Text>
      </View>
      <View style={styles.fieldContainer}>
        <Checkbox
          checked={filters['platinum']}
          onChange={() => onFilterChange('platinum', !filters['platinum'])}
        />
        <Text style={st.get(['FinePrint', 'SmLeftGutter'], viewport)}>
          Platinum
        </Text>
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

export default TiersFilterCard;
