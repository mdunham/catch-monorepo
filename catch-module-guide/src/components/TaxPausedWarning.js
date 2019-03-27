import React from 'react';
import { Text, View, ScrollView, SafeAreaView } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, Button, styles as st } from '@catch/rio-ui-kit';

const PREFIX = 'catch.TaxPausedWarning';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  p2: <FormattedMessage id={`${PREFIX}.p2`} />,
  dismissButton: <FormattedMessage id={`${PREFIX}.dismissButton`} />,
};

/**
 * This is pretty unopinionated and could be moved in common to be reused
 */
const TaxPausedWarning = ({ viewport, onDismiss }) => (
  <SafeAreaView style={st.get(['Peach', 'FullSize'])}>
    <View style={st.get(['CenterColumn', 'TopSpace', 'Margins'], viewport)}>
      <Icon name="tax-paused" size={60} />
      <Text style={st.get(['H3', 'XlTopGutter', 'BottomGutter'], viewport)}>
        {COPY['title']}
      </Text>
      <Text
        style={st.get(
          ['Body', 'BottomGutter', 'ContentMax', 'CenterText'],
          viewport,
        )}
      >
        {COPY['p1']}
      </Text>
      <Text
        style={st.get(
          ['Body', 'XlBottomGutter', 'ContentMax', 'CenterText'],
          viewport,
        )}
      >
        {COPY['p2']}
      </Text>
      <View style={st.get(['FullWidth', 'ButtonMax'])}>
        <Button viewport={viewport} wide onClick={onDismiss}>
          {COPY['dismissButton']}
        </Button>
      </View>
    </View>
  </SafeAreaView>
);

export default TaxPausedWarning;
