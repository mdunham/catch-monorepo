import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, colors } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

const PREFIX = 'catch.health.SavingsInfoCard';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
};

const SavingsInfoCard = ({ viewport, monthlySavings }) => (
  <View style={[styles.container, styles[`container${viewport}`]]}>
    <Text style={st.get(['FinePrint', 'Success'], viewport)}>
      {COPY['title']({
        amount: (
          <Text style={st.get(['FinePrint', 'Bold', 'Success'], viewport)}>
            <Currency>{monthlySavings}</Currency>
          </Text>
        ),
      })}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['algae+3'],
    borderColor: 'rgba(0, 161, 153, 0.3)',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: 327,
  },
  rule: {
    height: 1,
    backgroundColor: 'rgba(0, 161, 153, 0.3)',
    marginVertical: 16,
  },
  containerPhoneOnly: {
    width: '100%',
  },
});

export default SavingsInfoCard;
