import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Figure, LargeBlob, styles as st, Button } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.home.GuideCheckupCard';
export const COPY = {
  body: <FormattedMessage id={`${PREFIX}.body`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

const GuideCheckupCard = ({ onStart, viewport }) => (
  <View style={st.get(['Card', styles.container])}>
    <View style={styles.header}>
      <LargeBlob name="guide" viewport="PhoneOnly" />
    </View>
    <View style={styles.contentContainer}>
      <Text style={st.get(['Body', 'LgBottomGutter'], viewport)}>
        {COPY['body']}
      </Text>
      <Button onClick={onStart} viewport={viewport}>
        {COPY['button']}
      </Button>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 0,
    marginLeft: 8,
    marginRight: 8,
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    width: '100%',
  },
  contentContainer: {
    padding: 24,
  },
});

export default GuideCheckupCard;
