import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { Text, ReduxSlider, styles, Link } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

import { CatchUpLayout } from '../components';
import { CatchUpRetirement } from '../containers';

export const CatchUpRetirementView = ({
  breakpoints,
  onDeposit,
  onDismiss,
  viewport,
}) => (
  <CatchUpRetirement>
    {({ loading, projectedValue, depositAmount }) => (
      <CatchUpLayout
        breakpoints={breakpoints}
        viewport={viewport}
        onClose={onDismiss}
        headerTitle="Contributing to Retirement"
        disableButton={projectedValue === 0}
        onSubmit={() => onDeposit(depositAmount)}
        reverse={breakpoints.select({ PhoneOnly: true })}
        goalType="RETIREMENT"
        wide
      >
        <View
          style={styles.get(
            [
              'Flex1',
              'Margins',
              'CenterColumn',
              'LgTopGutter',
              'LgBottomGutter',
              breakpoints.select({
                'TabletLandscapeUp|TabletPortraitUp': 'DividerRight',
              }),
            ],
            viewport,
          )}
        >
          <Text mt={1} size="large">
            Today's deposit:
          </Text>
          <Text my={1} size={20} weight="medium">
            <Currency>{depositAmount}</Currency>
          </Text>
          <Field
            name="depositAmount"
            component={ReduxSlider}
            min={0}
            max={2500}
            step={1}
            value={depositAmount}
          />
        </View>
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
          <Text size="large" center>
            Projected value at age 65:
          </Text>
          <Text my={1} size={viewport === 'PhoneOnly' ? 48 : 32} weight="bold">
            <Currency>{projectedValue}</Currency>
          </Text>
          <Link
            to="https://help.catch.co/building-for-retirement/how-do-you-calculate-my-retirement-plans-projected-value"
            newTab
          >
            How is this calculated?
          </Link>
        </View>
      </CatchUpLayout>
    )}
  </CatchUpRetirement>
);

CatchUpRetirementView.propTypes = {
  onDeposit: PropTypes.func.isRequired,
};

const withReduxForm = reduxForm({
  form: 'DepositAmount',
});

const Component = withReduxForm(CatchUpRetirementView);
Component.displayName = 'CatchUpRetirementView';

export default Component;
