import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform } from 'react-native';

import {
  Text,
  borderRadius,
  colors,
  fontColors,
  Icon,
} from '@catch/rio-ui-kit';

const iconMap = {
  VITAL: 'triangle-outline',
  IMPORTANT: 'ellipse',
  CONSIDER: 'square',
  COVERED: 'covered-check',
  CONTRIBUTING: 'covered-check',
  PAUSED: 'paused',
};

const iconStrokes = {
  VITAL: '#AD403D',
  IMPORTANT: '#BF6211',
  CONSIDER: '#3A56A6',
  COVERED: '#006B66',
  CONTRIBUTING: '#006B66',
  PAUSED: '#62697A',
};

function hideFlag(type, original) {
  if (
    !type ||
    (type === 'NONE' && original === 'NONE') ||
    // Temporary solution before we add the `INTERESTED` flag
    // We know IMPORTANT was manually set if the original is not
    (type === 'IMPORTANT' && original !== 'IMPORTANT')
  ) {
    return true;
  }
}
/**
 * If the type is NONE we need to keep the original recommendation
 * and display that instead. The original may be NONE which is ok
 */
function selectFlag(type, original) {
  if (type === 'NONE') {
    return original;
  }
  return type;
}

const GuideFlag = ({ type, style, original }) =>
  hideFlag(type, original) ? (
    <View accessibilityLabel="no_flag" style={styles.placeholder} />
  ) : (
    <View
      accessibilityLabel={`flag_${selectFlag(type, original).toLowerCase()}`}
      style={[styles.container, style]}
    >
      <View style={styles.icon}>
        <Icon
          name={iconMap[selectFlag(type, original)]}
          stroke={iconStrokes[selectFlag(type, original)]}
          dynamicRules={{
            paths: { stroke: iconStrokes[selectFlag(type, original)] },
            circles: { stroke: iconStrokes[selectFlag(type, original)] },
            rects: { stroke: iconStrokes[selectFlag(type, original)] },
          }}
          fill="none"
          size={Platform.select({ web: 10 })}
        />
      </View>
      <Text
        size={11}
        spacing={0.5}
        weight="bold"
        style={[styles.base, styles[selectFlag(type, original)]]}
      >
        {selectFlag(type, original)}
      </Text>
    </View>
  );

const styles = StyleSheet.create({
  container: {
    // This rule prevents the flag from covering the
    // right overflow menu
    alignSelf: 'baseline',
    borderRadius: 4,
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: 7,
    zIndex: 10,
  },
  // @TODO: better organize this
  outline: {
    overflow: 'hidden',
    borderRadius: 999,
    borderColor: colors.grass,
    borderWidth: 1,
    borderStyle: 'solid',
  },
  base: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    paddingLeft: 26,
    backgroundColor: colors.primary,
    color: fontColors.white,
    borderRadius: 4,
  },
  placeholder: {
    height: 23,
    alignSelf: 'baseline',
  },
  VITAL: {
    backgroundColor: '#FEE0E0',
    color: '#AD403D',
  },
  IMPORTANT: {
    backgroundColor: '#FFE6D1',
    color: '#BF6211',
  },
  CONSIDER: {
    backgroundColor: '#F5F7FF',
    color: '#3A56A6',
  },
  COVERED: {
    backgroundColor: '#E6F0F0',
    color: '#006B66',
  },
  CONTRIBUTING: {
    backgroundColor: '#E6F0F0',
    color: '#006B66',
  },
  PAUSED: {
    backgroundColor: '#EBECEE',
    color: '#62697A',
  },
});

GuideFlag.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  style: PropTypes.object,
  type: PropTypes.oneOf([
    'VITAL',
    'IMPORTANT',
    'CONSIDER',
    'NONE',
    'PAUSED',
    'COVERED',
    'CONTRIBUTING',
  ]),
};

export default GuideFlag;
