import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { Icon, colors, styles } from '@catch/rio-ui-kit';

import bankLogos from '../assets/small/';

const applyFunc = (obj, bankName) =>
  typeof obj === 'function' ? obj({ bankName }) : obj;

const LoginHeader = ({
  name,
  notes,
  color,
  nameKey,
  error,
  onBack,
  breakpoints: { select, current },
}) => {
  const bankIcon = bankLogos[nameKey] ? (
    <Image
      resizeMode="contain"
      style={localStyles.bankLogo}
      source={Platform.select({
        web: { uri: bankLogos[nameKey] },
        default: bankLogos[nameKey],
      })}
    />
  ) : (
    <Icon
      name="bank"
      fill="#D7D9DE"
      dynamicRules={{ paths: { fill: '#D7D9DE' } }}
      size={40}
    />
  );
  const title = (
    <View style={styles.get(['Container', 'Flex2'])}>
      <Text style={styles.get('H3', current)}>Sign in to</Text>
      <Text style={styles.get(['H3', 'BottomGutter'], current)}>{name}</Text>
    </View>
  );
  const titleRow = select({
    PhoneOnly: (
      <View style={styles.get(['Container'])}>
        <View
          style={styles.get([
            'CenterColumn',
            'Flex1',
            'LgTopGutter',
            'LgBottomGutter',
          ])}
        >
          {bankIcon}
        </View>
        {title}
      </View>
    ),
    'TabletPortraitUp|TabletLandscapeUp': (
      <View style={styles.get('Row')}>
        {title}
        <View style={styles.get('TopGutter')}>{bankIcon}</View>
      </View>
    ),
  });

  return (
    <View>
      {Platform.OS === 'web' &&
        select({
          PhoneOnly: (
            <View
              style={styles.get(['RowContainer', 'TopGutter', 'BottomGutter'])}
            >
              <Icon
                name="right"
                onClick={onBack}
                fill={colors.primary}
                stroke={colors.primary}
                dynamicRules={{ paths: { fill: colors.primary } }}
                style={{ transform: [{ rotate: '180deg' }] }}
              />
            </View>
          ),
          'TabletPortraitUp|TabletLandscapeUp': (
            <View
              style={styles.get([
                'CenterRightRow',
                'TopGutter',
                'BottomGutter',
              ])}
            >
              <Icon
                name="close"
                size={20}
                fill={colors.gray3}
                dynamicRules={{ paths: { fill: colors.gray3 } }}
                onClick={onBack}
              />
            </View>
          ),
        })}
      {titleRow}
      {(!!error || !!notes) && (
        <Text style={styles.get('FinePrint', current)}>
          {applyFunc(error, name) || notes}
        </Text>
      )}
    </View>
  );
};

const localStyles = StyleSheet.create({
  bankLogo: {
    height: 40,
    width: 100,
  },
  topBar: {
    maxHeight: 64,
  },
});

export default LoginHeader;
