import React from 'react';
import { View } from 'react-native';

import { Flag, Text, H3, styles } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

import { CatchUpLayout } from '../components';
import { CatchUpTimeoff } from '../containers';

export const CatchUpTimeoffView = ({
  breakpoints,
  viewport,
  onDeposit,
  onDismiss,
}) => (
  <CatchUpTimeoff>
    {({ loading, suggestedDepositAmount }) => (
      <CatchUpLayout
        breakpoints={breakpoints}
        viewport={viewport}
        onClose={onDismiss}
        headerTitle="Contributing to Time Off"
        onSubmit={() => onDeposit(suggestedDepositAmount)}
        center
      >
        <View
          style={styles.get(
            [
              'Flex1',
              'Margins',
              'CenterColumn',
              'LgTopGutter',
              'LgBottomGutter',
            ],
            viewport,
          )}
        >
          <H3>Suggested deposit</H3>
          <Text style={styles.get('CenterText')} mt={1} mx={2}>
            Based on your estimated annual income, here's what one day of
            vacation would cost:
          </Text>
          <Text mt={2} mb={1} size={32} weight="bold">
            {loading ? (
              'Calculating...'
            ) : (
              <Currency>{suggestedDepositAmount}</Currency>
            )}
          </Text>
          <View>
            <Flag type="dayoff" size={12} weight="medium">
              1 PAID DAY OFF
            </Flag>
          </View>
        </View>
      </CatchUpLayout>
    )}
  </CatchUpTimeoff>
);

export default CatchUpTimeoffView;
