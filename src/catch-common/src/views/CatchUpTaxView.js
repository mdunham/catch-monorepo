import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { format } from 'date-fns';

import { Flag, Box, Text, InfoTooltip, styles, H2 } from '@catch/rio-ui-kit';
import { Currency, precisionRound } from '@catch/utils';

import { CatchUpLayout } from '../components';
import { CatchUpTax } from '../containers';
import { SuggestedIncomeForm } from '../forms';

export const CatchUpTaxView = ({
  breakpoints,
  onDeposit,
  onDismiss,
  viewport,
}) => (
  <CatchUpTax>
    {({
      amountOwedNow,
      workType,
      quarterStartDate,
      paycheckPercentage,
      projectedAmountEarned,
      thisQuarter,
      loading,
    }) => (
      <CatchUpLayout
        onClose={onDismiss}
        breakpoints={breakpoints}
        disableButton={amountOwedNow === 0}
        viewport={viewport}
        headerTitle={`Catching up on Q${thisQuarter} taxes`}
        paycheckPercentage={paycheckPercentage}
        goalType="TAX"
        onSubmit={() => onDeposit(amountOwedNow)}
        loading={loading}
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
          <Text size="large">
            {workType === 'WORK_TYPE_1099'
              ? 'Estimated income'
              : 'Estimated 1099 income'}
          </Text>

          <Box row>
            <Text mr={1} weight="bold" mb={1}>{`${format(
              quarterStartDate,
              'MMM D',
            )}. - Today`}</Text>
            <InfoTooltip
              direction="top"
              body="This value is calculated based on how many weeks today's date is into the current tax quarter and your estimated annual income."
            />
          </Box>

          <SuggestedIncomeForm
            initialValues={{ amount: projectedAmountEarned }}
            viewport={viewport}
          />
        </View>
        {breakpoints.select({
          PhoneOnly: (
            <View
              style={styles.get(['CenterColumn', 'Divider', 'LgBottomGutter'])}
            >
              <View>
                <Flag
                  mb={-12}
                  type="percentage"
                  size={12}
                  weight="medium"
                  rounded
                  center
                >{`${precisionRound(
                  paycheckPercentage * 100,
                  2,
                )}% TAX WITHHOLDING`}</Flag>
              </View>
            </View>
          ),
        })}
        <View
          style={styles.get(
            ['Flex1', 'Margins', 'CenterColumn', 'LgTopGutter'],
            viewport,
          )}
        >
          <Text size="large">Suggested deposit</Text>
          <H2 size={viewport === 'PhoneOnly' && 48}>
            <Currency>{amountOwedNow}</Currency>
          </H2>
          <Text
            size="tiny"
            align="center"
            mt={1}
            style={styles.get('CenterText')}
          >
            This suggestion is an estimate and does not reflect your legal tax
            burden.
          </Text>
        </View>
      </CatchUpLayout>
    )}
  </CatchUpTax>
);

CatchUpTaxView.propTypes = {
  onDeposit: PropTypes.func.isRequired,
};

export default CatchUpTaxView;
