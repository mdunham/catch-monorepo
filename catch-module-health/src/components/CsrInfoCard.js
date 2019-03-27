import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, colors, Icon } from '@catch/rio-ui-kit';

const PREFIX = 'catch.health.CsrInfoCard';
export const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
  emphasis: <FormattedMessage id={`${PREFIX}.emphasis`} />,
};

const CsrInfoCard = ({ viewport }) => (
  <View style={[styles.container, styles[`container${viewport}`]]}>
    <Icon
      name="price-tag"
      fill={colors['algae-1']}
      dynamicRules={{
        paths: { fill: colors['algae-1'] },
      }}
      size={Platform.select({ web: 32 })}
      height={32}
      width={38}
    />
    <Text style={st.get(['FinePrint', 'Success', 'LeftGutter'], viewport)}>
      {COPY['title']({
        emphasis: (
          <Text style={st.get(['FinePrint', 'Bold', 'Success'], viewport)}>
            {COPY['emphasis']}
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
    padding: 16,
    width: 327,
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  containerPhoneOnly: {
    width: '100%',
  },
});

export default CsrInfoCard;
