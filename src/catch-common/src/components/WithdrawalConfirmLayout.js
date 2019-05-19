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
  Text,
  H2,
  H3,
  Icon,
  Divider,
  colors,
  Button,
  styles,
} from '@catch/rio-ui-kit';
import { formatCurrency } from '@catch/utils';

const PREFIX = 'catch.plans.withdraw.WithdrawalConfirmLayout';
export const COPY = {
  back: <FormattedMessage id={`${PREFIX}.back`} />,
  confirmButton: <FormattedMessage id={`${PREFIX}.confirmButton`} />,
  fromLabel: <FormattedMessage id={`${PREFIX}.fromLabel`} />,
  toLabel: <FormattedMessage id={`${PREFIX}.toLabel`} />,
  withdrawHeader: <FormattedMessage id={`${PREFIX}.withdrawHeader`} />,
};
const isWeb = Platform.OS === 'web';

const WithdrawalConfirmLayout = ({
  amountToWithdraw,
  onBack,
  onNext,
  isLoading,
  sendView,
  withdrawalRows,
  breakpoints,
}) => (
  <SafeAreaView style={styles.get('Flex1')}>
    {isWeb && (
      <Box mt={3} mx={3}>
        <Box mb={2} row>
          <Icon
            name="left"
            fill={colors.primary}
            stroke={colors.primary}
            size={17}
            onClick={onBack}
          />
          {breakpoints.select({
            'TabletLandscapeUp|TabletPortraitUp': (
              <Box ml={1}>
                <Text color="link" size={16} onClick={onBack}>
                  {COPY['back']}
                </Text>
              </Box>
            ),
          })}
        </Box>
      </Box>
    )}
    <Box mt={2} mb={4} align="center">
      <H3 weight="normal">{COPY['withdrawHeader']}</H3>
      <H2 weight="medium">{formatCurrency(parseFloat(amountToWithdraw))}</H2>
    </Box>
    <Divider />
    <Box my={2} mx={3}>
      <Text size={12} weight="medium" color="subtle">
        {COPY['fromLabel']}
      </Text>
      <Box>{withdrawalRows}</Box>
    </Box>
    <Box mx={3}>
      <Divider />
    </Box>
    <Box my={2} mx={3}>
      <Text size={12} weight="medium" color="subtle">
        {COPY['toLabel']}
      </Text>
      <Box>{sendView}</Box>
    </Box>
    {breakpoints.select({
      PhoneOnly: (
        <Box
          absolute="vodka"
          style={{ left: 0, right: 0, bottom: 0, height: 72 }}
          p={2}
        >
          <Button color="secondary" wide onClick={onNext} disabled={isLoading}>
            {isLoading ? 'Processing...' : COPY['confirmButton']}
          </Button>
        </Box>
      ),
      'TabletLandscapeUp|TabletPortraitUp': (
        <Box ml="auto" my={3} mr={3}>
          <Button
            viewport="TabletLandscapeUp"
            color="secondary"
            onClick={onNext}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : COPY['confirmButton']}
          </Button>
        </Box>
      ),
    })}
  </SafeAreaView>
);

WithdrawalConfirmLayout.propTypes = {
  amountToWithdraw: oneOfType([number, string]).isRequired,
  onBack: func.isRequired,
  onNext: func.isRequired,
  sendView: node.isRequired,
  withdrawalRows: node.isRequired,
  isLoading: bool,
  breakpoints: object.isRequired,
};

WithdrawalConfirmLayout.defaultProps = {
  isLoading: false,
};

export default WithdrawalConfirmLayout;
