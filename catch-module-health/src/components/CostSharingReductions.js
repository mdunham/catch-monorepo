import React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, styles as st, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.CostSharingReductions';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  link: <FormattedMessage id={`${PREFIX}.link`} />,
};

const CostSharingReductions = ({ viewport }) => (
  <View
    style={st.get([
      'CenterColumn',
      'ContentMax',
      'FullWidth',
      'XlBottomGutter',
    ])}
  >
    <View style={styles.dividerContainer}>
      <View style={styles.divider} />
      <Text style={st.get(['H6'], viewport)}>PLUS</Text>
      <View style={styles.divider} />
    </View>
    <View style={st.get(['Row', 'BottomGutter'])}>
      <Icon name="success-check" size={18} />
      <Text
        style={st.get(['Body', 'Bold', 'CenterText', 'SmLeftGutter'], viewport)}
      >
        {COPY['title']}
      </Text>
    </View>
    <Text style={st.get(['Body', 'CenterText', 'BottomGutter'], viewport)}>
      {COPY['p1']}
    </Text>
    <Text
      href="https://www.healthcare.gov/glossary/cost-sharing-reduction/"
      target="_blank"
      accessibilityRole={Platform.select({
        web: 'link',
      })}
      style={st.get(['BodyLink'], viewport)}
    >
      {COPY['link']}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
  },
  divider: {
    height: 2,
    width: '35%',
    backgroundColor: colors.sage,
    marginHorizontal: 18,
  },
});

export default CostSharingReductions;
