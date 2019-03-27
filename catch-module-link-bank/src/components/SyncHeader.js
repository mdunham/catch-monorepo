import React from 'react';
import PropTypes from 'prop-types';
import { Platform, Image, Text, View } from 'react-native';

import { Icon, styles } from '@catch/rio-ui-kit';

import bankLogos from '../assets/small';

/**
 * If you provide a subtitle, the text will be left aligned
 */
const SyncHeader = ({ title, subtitle, iconName, viewport }) => (
  <View
    style={styles.get(
      ['CenterColumn', 'LgTopGutter', 'LgBottomGutter'],
      viewport,
    )}
  >
    {bankLogos[iconName] ? (
      <Image
        resizeMode="contain"
        source={Platform.select({
          web: { uri: bankLogos[iconName] },
          default: bankLogos[iconName],
        })}
      />
    ) : (
      <Icon
        name="bank"
        fill="#D7D9DE"
        dynamicRules={{ paths: { fill: '#D7D9DE' } }}
        size={40}
      />
    )}
    {!!title && (
      <Text
        style={styles.get(
          subtitle
            ? ['H3', 'FullWidth', 'LgTopGutter']
            : ['H4', 'FullWidth', 'LgTopGutter', 'CenterText'],
          viewport,
        )}
      >
        {title}
      </Text>
    )}
    {!!subtitle && (
      <Text style={styles.get(['Body', 'FullWidth', 'TopGutter'], viewport)}>
        {subtitle}
      </Text>
    )}
  </View>
);

SyncHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  iconName: PropTypes.string,
};

export default SyncHeader;
