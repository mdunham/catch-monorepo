import React from 'react';
import PropTypes from 'prop-types';
import { Text, View, ScrollView, StyleSheet } from 'react-native';

import {
  Box,
  styles,
  withDimensions,
  colors,
  SplitLayout,
  Button,
  Flag,
  Spinner,
  Divider,
  Icon,
} from '@catch/rio-ui-kit';
import { precisionRound } from '@catch/utils';

const localStyles = StyleSheet.create({
  header: {
    backgroundColor: colors['peach+2'],
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31,37,51,0.15)',
  },
  content: {},
  base: { width: '100%', maxWidth: 650 },
});

const CatchUpLayout = ({
  breakpoints,
  headerTitle,
  center,
  disableButton,
  onSubmit,
  children,
  loading,
  paycheckPercentage,
  onClose,
  goalType,
  reverse,
  wide,
}) => (
  <View
    style={styles.get(
      [
        'Container',
        'BottomSpace',
        wide
          ? breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': { minWidth: 639 },
            })
          : 'ModalMax',
      ],
      breakpoints.current,
    )}
  >
    <View
      style={styles.get(
        ['FullWidth', 'Margins', localStyles.header],
        breakpoints.current,
      )}
    >
      <View
        style={styles.get([
          breakpoints.select({
            PhoneOnly: 'TopLeftControl',
            'TabletLandscapeUp|TabletPortraitUp': 'TopRightControl',
          }),
        ])}
      >
        <Icon
          onClick={onClose}
          name="close"
          fill={colors.ink}
          dynamicRules={{ paths: { fill: colors.ink } }}
        />
      </View>
      <View
        style={styles.get(['CenterColumn', 'LgBottomGutter', 'LgTopGutter'])}
      >
        <Text style={styles.get('H4S', breakpoints.current)}>
          {headerTitle}
        </Text>
      </View>
    </View>
    {goalType === 'TAX' &&
      breakpoints.select({
        'TabletLandscapeUp|TabletPortraitUp': (
          <View style={styles.get('CenterColumn')}>
            <View>
              <Flag
                mt={-10}
                type="percentage"
                size={12}
                weight="medium"
                rounded
                center
              >{`${precisionRound(
                paycheckPercentage * 100,
                2,
              )}% ${goalType} WITHHOLDING`}</Flag>
            </View>
          </View>
        ),
      })}
    <ScrollView>
      <View
        style={styles.get(
          ['FluidContainer', 'LgTopGutter', 'LgBottomGutter'],
          breakpoints.current,
        )}
      >
        {loading ? (
          <Spinner large />
        ) : reverse ? (
          React.Children.toArray(children).reverse()
        ) : (
          children
        )}
      </View>
    </ScrollView>
    <View
      style={styles.get(
        [
          'CenterRightRow',
          center && 'CenterRow',
          'TopGutter',
          'Margins',
          'BottomBar',
          breakpoints.select({
            'TabletLandscapeUp|TabletPortraitUp': 'BottomGutter',
          }),
        ],
        breakpoints.current,
      )}
    >
      <View style={styles.get([breakpoints.select({ PhoneOnly: 'Flex1' })])}>
        <Button
          onClick={onSubmit}
          disabled={disableButton}
          viewport={breakpoints.current}
          wide={breakpoints.select({ PhoneOnly: true })}
        >
          Make a deposit
        </Button>
      </View>
    </View>
  </View>
);

export default CatchUpLayout;
