import React from 'react';
import { Platform, SafeAreaView } from 'react-native';
import {
  bool,
  func,
  node,
  number,
  oneOfType,
  string,
  object,
} from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Divider,
  H3,
  Text,
  Button,
  Icon,
  colors,
  styles,
} from '@catch/rio-ui-kit';
import { formatCurrency } from '@catch/utils';

const PREFIX = 'catch.plans.withdraw.WithdrawalConfigLayout';
export const COPY = {
  nextButton: values => (
    <FormattedMessage id={`${PREFIX}.nextButton`} values={values} />
  ),
  sendLabel: <FormattedMessage id={`${PREFIX}.sendLabel`} />,
  withdrawLabel: <FormattedMessage id={`${PREFIX}.withdrawLabel`} />,
};
const isWeb = Platform.OS === 'web';

const WithdrawalConfigLayout = ({
  isButtonDisabled,
  onSubmit,
  sendView,
  totalToWithdraw,
  withdrawalView,
  breakpoints,
  onBack,
}) => (
  <SafeAreaView style={styles.get('Flex1')}>
    {isWeb &&
      breakpoints.select({
        PhoneOnly: (
          <Box mt={3} mx={3}>
            <Box mb={2} row>
              <Icon
                name="left"
                fill={colors.primary}
                stroke={colors.primary}
                size={17}
                onClick={onBack}
              />
            </Box>
          </Box>
        ),
      })}
    <Box mx={3} mt={3}>
      <Box align="center">
        <H3>{COPY['withdrawLabel']}</H3>
      </Box>
      <Box mt={2}>{withdrawalView}</Box>
    </Box>
    <Divider />
    <Box mx={3} mt={3}>
      <Box align="center">
        <H3>{COPY['sendLabel']}</H3>
      </Box>
      <Box mt={2}>{sendView}</Box>
    </Box>
    {breakpoints.select({
      PhoneOnly: (
        <Box
          absolute="vodka"
          style={{ left: 0, right: 0, bottom: 0, height: 72 }}
          p={2}
        >
          <Button wide onClick={onSubmit} disabled={isButtonDisabled}>
            {COPY['nextButton']({
              amount: formatCurrency(totalToWithdraw),
            })}
          </Button>
        </Box>
      ),
      'TabletLandscapeUp|TabletPortraitUp': (
        <Box mt={2} mb={3} mx={3} justify="flex-end" row>
          <Button
            viewport="TabletLandscapeUp"
            onClick={onSubmit}
            disabled={isButtonDisabled}
          >
            {COPY['nextButton']({
              amount: formatCurrency(totalToWithdraw),
            })}
          </Button>
        </Box>
      ),
    })}
  </SafeAreaView>
);

WithdrawalConfigLayout.propTypes = {
  isButtonDisabled: bool.isRequired,
  onSubmit: func.isRequired,
  sendView: node.isRequired,
  totalToWithdraw: oneOfType([number, string]).isRequired,
  withdrawalView: node.isRequired,
  breakpoints: object.isRequired,
};

export default WithdrawalConfigLayout;
