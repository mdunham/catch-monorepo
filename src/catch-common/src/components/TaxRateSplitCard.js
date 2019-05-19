import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';

import { styles as st, Text, Flag, Divider, Icon } from '@catch/rio-ui-kit';
import { Currency, Percentage } from '@catch/utils';

const TaxRateSplitCard = ({
  currentRate,
  currentEstimate,
  suggestedRate,
  suggestedEstimate,
}) => (
  <View style={st.get(['ContainerRow', 'FullWidth', 'CenterColumn'])}>
    <View style={st.get(['Flex1', 'CenterColumn', 'LightGray', 'Rounded'])}>
      <Text weight="bold" spacing={0.5} color="ink" mt={2} size={11}>
        CURRENT
      </Text>
      <Text weight="bold" size={32} mt={1}>
        <Percentage whole>{currentRate}</Percentage>
      </Text>
      <Text size="small" mb={1}>
        per paycheck
      </Text>
      <Text size="small">
        About{' '}
        <Text size="small" weight="medium">
          <Currency>{currentEstimate}</Currency>
        </Text>
      </Text>
      <Text size="small" mb={3}>
        per month
      </Text>
    </View>
    <View style={styles.middleIcon}>
      <Icon name="right-arrow" size={Platform.select({ web: 21 })} />
    </View>
    <View style={st.get(['Flex1', 'CenterColumn', 'Sage', 'Rounded'])}>
      <Text weight="bold" spacing={0.5} color="algae-1" mt={2} size={11}>
        RECOMMENDED
      </Text>
      <Text weight="bold" size={32} mt={1}>
        <Percentage whole>{suggestedRate}</Percentage>
      </Text>
      <Text size="small" mb={1}>
        per paycheck
      </Text>
      <Text size="small">
        About{' '}
        <Text size="small" weight="medium">
          <Currency>{suggestedEstimate}</Currency>
        </Text>
      </Text>
      <Text size="small" mb={3}>
        per month
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  middleIcon: {
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
});

export default TaxRateSplitCard;
