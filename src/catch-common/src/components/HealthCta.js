import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, Icon, colors, borderRadius } from '@catch/rio-ui-kit';

const PREFIX = 'catch.guide.HealthCta';
const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  cta: <FormattedMessage id={`${PREFIX}.cta`} />,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors['flare+4'],
    borderRadius: borderRadius.regular,
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  containerPhoneOnly: {
    width: '100%',
  },
});

export const HealthCta = ({ viewport, onPress, center }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, styles[`container${viewport}`]]}
  >
    <View style={st.get(viewport !== 'PhoneOnly' && center && 'CenterColumn')}>
      <Text style={st.get('FinePrint', viewport)}>{COPY['title']}</Text>
      <Text style={st.get('FinePrintLink', viewport)}>{COPY['cta']}</Text>
    </View>
    {viewport === 'PhoneOnly' && (
      <Icon
        name="right"
        fill={colors.flare}
        size={14}
        dynamicRules={{
          paths: {
            fill: colors.flare,
            stroke: colors.flare,
            strokeWidth: 4,
          },
        }}
      />
    )}
  </TouchableOpacity>
);

HealthCta.propTypes = {
  onPress: PropTypes.func.isRequired,
  viewport: PropTypes.string.isRequired,
};

export default HealthCta;
