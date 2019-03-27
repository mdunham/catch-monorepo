import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, StyleSheet } from 'react-native';

import {
  Button,
  styles as st,
  Icon,
  Launchpad,
  Figure,
} from '@catch/rio-ui-kit';

import StateExchangeLaunchpad from './StateExchangeLaunchpad';

const StateSupportMessage = ({
  onNext,
  viewport,
  title,
  paragraphs,
  buttonText,
  buttonIcon,
  state,
  icon,
  url,
}) => (
  <View style={styles.container}>
    <Launchpad>
      {icon ? <Icon {...icon} /> : <StateExchangeLaunchpad state={state} />}
    </Launchpad>
    <View style={styles.contentContainer}>
      <Text
        style={st.get(
          ['H4', 'LgBottomGutter', 'CenterText', 'ButtonMax'],
          viewport,
        )}
      >
        {title}
      </Text>
      {paragraphs.map((p, i) => (
        <Text
          key={`p-${i}`}
          style={st.get(['Body', 'LgBottomGutter', 'CenterText'], viewport)}
        >
          {p}
        </Text>
      ))}
      {viewport !== 'PhoneOnly' && (
        <Button
          onClick={onNext}
          viewport={viewport}
          icon={buttonIcon}
          href={url}
        >
          {buttonText}
        </Button>
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 6,
    overflow: 'hidden',
  },
  contentContainer: {
    maxWidth: 330,
    paddingBottom: 40,
    alignItems: 'center',
  },
});

StateSupportMessage.propTypes = {
  onNext: PropTypes.func,
  viewport: PropTypes.string.isRequired,
  icon: PropTypes.object,
};

export default StateSupportMessage;
