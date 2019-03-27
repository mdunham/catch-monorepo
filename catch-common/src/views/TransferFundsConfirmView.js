import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  View,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

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
import { Currency } from '@catch/utils';

import { GOAL_ACCOUNTS } from '../utils';

const PREFIX = 'catch.plans.withdraw.WithdrawalConfirmLayout';
export const COPY = {
  back: <FormattedMessage id={`${PREFIX}.back`} />,
  confirmButton: <FormattedMessage id={`${PREFIX}.confirmButton`} />,
  fromLabel: <FormattedMessage id={`${PREFIX}.fromLabel`} />,
  toLabel: <FormattedMessage id={`${PREFIX}.toLabel`} />,
  withdrawHeader: <FormattedMessage id={`${PREFIX}.withdrawHeader`} />,
};
const isWeb = Platform.OS === 'web';

const TransferFundsConfirmView = ({
  onBack,
  isLoading,
  breakpoints,
  transferType,
  transferAmount,
  onTransfer,
  toAccount,
  fromAccount,
  formGoalType,
}) => {
  transferAmount = parseFloat(transferAmount);
  return (
    <KeyboardAvoidingView
      behavior={Platform.select({
        ios: 'padding',
      })}
      style={styles.get(
        [
          'Container',
          'ModalMax',
          breakpoints.select({
            'TabletLandscapeUp|TabletPortraitUp': 'BottomGutter',
          }),
        ],
        breakpoints.current,
      )}
    >
      <ScrollView
        contentContainerStyle={styles.get(['BottomSpace'], breakpoints.current)}
      >
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
            'TabletLandscapeUp|TabletPortraitUp': (
              <Box mt={3} ml={3} mb={2} align="center" row>
                <Icon
                  name="left"
                  fill={colors.ink}
                  stroke={colors.ink}
                  size={13}
                  onClick={onBack}
                />
                <Text ml={1} weight="medium" color="ink" onClick={onBack}>
                  Back
                </Text>
              </Box>
            ),
          })}
        <Box my={4} align="center">
          <H3 weight="normal">Transfer</H3>
          <H2 weight="medium">
            <Currency>{transferAmount}</Currency>
          </H2>
        </Box>
        <Divider />
        <Box my={2} mx={3}>
          <Text size={12} weight="medium" color="subtle">
            {COPY['fromLabel']}
          </Text>
          <Box justify="space-between" row>
            <Text weight="medium">
              {fromAccount || GOAL_ACCOUNTS[formGoalType]}
            </Text>
            <Text>
              <Currency>{transferAmount}</Currency>
            </Text>
          </Box>
        </Box>
        <Box mx={3}>
          <Divider />
        </Box>
        <Box mt={2} mb={4} mx={3}>
          <Text size={12} weight="medium" color="subtle">
            {COPY['toLabel']}
          </Text>
          <Text weight="medium">
            {toAccount || GOAL_ACCOUNTS[formGoalType]}
          </Text>
        </Box>
      </ScrollView>
      <View
        style={styles.get(
          ['BottomBar', 'Margins', 'ContainerRow'],
          breakpoints.current,
        )}
      >
        <View style={styles.get('CenterRightRow')}>
          <Button
            type="success"
            disabled={isLoading}
            onClick={onTransfer}
            viewport={breakpoints.current}
            wide={breakpoints.select({ PhoneOnly: true })}
          >
            {isLoading
              ? 'Processing...'
              : transferType === 'deposit'
                ? 'Confirm deposit'
                : COPY['confirmButton']}
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

TransferFundsConfirmView.propTypes = {
  breakpoints: PropTypes.object,
  formGoalType: PropTypes.string,
  fromAccount: PropTypes.string,
  isLoading: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  toAccount: PropTypes.string,
};

TransferFundsConfirmView.defaultProps = {
  isLoading: false,
};

const withRedux = connect(state => ({
  transferAmount: formValueSelector('TransferFundsForm')(
    state,
    'transferAmount',
  ),
}));
const Component = withRedux(TransferFundsConfirmView);
Component.displayName = 'TransferFundsConfirmView';

export default Component;
