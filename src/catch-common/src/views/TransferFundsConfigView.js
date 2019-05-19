/**
 * TransferFundsConfigView
 *
 * This view handles the configuration step of depositing and withdrawing to/from Catch accounts
 */

import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';

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
import { createLogger, Currency, formatCurrency } from '@catch/utils';

import { TransferFundsForm, GoalTransferForm } from '../forms';
import { GOAL_ACCOUNTS } from '../utils';

const Log = createLogger('transfer-funds-config-view');

const PREFIX = 'catch.plans.withdraw.WithdrawalConfigLayout';
export const COPY = {
  nextButton: values => (
    <FormattedMessage id={`${PREFIX}.nextButton`} values={values} />
  ),
  sendLabel: <FormattedMessage id={`${PREFIX}.sendLabel`} />,
  withdrawLabel: <FormattedMessage id={`${PREFIX}.withdrawLabel`} />,
};
const isWeb = Platform.OS === 'web';

const DAILY_DEPOSIT_LIMIT = 2500;

const handleDepositValidation = ({
  primaryAccountBalance,
  transferLimit,
  depositValidation,
  recentDeposits,
}) => {
  return (
    <Box px={3} mt={-30} ml="auto">
      <Text color="emphasis" size="tiny" weight="medium" right>
        {depositValidation === 'EXCEEDS_DAILY_LIMIT' &&
          `The daily deposit limit for a Catch account is ${formatCurrency(
            DAILY_DEPOSIT_LIMIT,
          )}. Please deposit ${formatCurrency(
            transferLimit && transferLimit.toFixed(2),
          )} or less.`}
        {depositValidation === 'EXCEEDS_DAILY_LIMIT_WITH_DEPOSITS' &&
          `The daily deposit limit for a Catch account is ${formatCurrency(
            DAILY_DEPOSIT_LIMIT,
          )}. You have already deposited ${formatCurrency(
            recentDeposits && recentDeposits.toFixed(2),
          )} today. Please deposit ${formatCurrency(
            transferLimit && transferLimit.toFixed(2),
          )} or less.`}
      </Text>
    </Box>
  );
};

export const TransferFundsConfigView = ({
  onNext,
  breakpoints,
  onBack,
  transferAmount,
  transferType,
  goalType,
  goalBalances,
  recentDeposits,
  goalsAvailableForTransfers,
  toAccount,
  fromAccount,
  transferLimit,
  formGoalType,
  initialTransferAmount,
  onBackToCatchUp,
  depositValidation,
  primaryAccountBalance,
}) => {
  transferAmount = parseFloat(transferAmount);

  // is the user trying to withdraw funds they actually have?
  const validWithdrawalAmount = goalType
    ? transferAmount <= goalBalances[goalType]
    : transferAmount <= goalBalances[formGoalType];
  const transferAmountExceedsDailyLimit =
    transferType === 'deposit' && transferAmount > transferLimit;

  const validDepositAmount = depositValidation === 'OK';

  const isFormValid =
    transferType === 'deposit' ? validDepositAmount : validWithdrawalAmount;

  Log.debug({ formGoalType, goalsAvailableForTransfers });

  Log.debug(transferType);

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
                    onClick={onBackToCatchUp || onBack}
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
                  onClick={onBackToCatchUp || onBack}
                />
                <Text
                  ml={1}
                  weight="medium"
                  color="ink"
                  onClick={onBackToCatchUp || onBack}
                >
                  Back
                </Text>
              </Box>
            ),
          })}

        <View
          style={styles.get(['Margins', 'LgTopGutter'], breakpoints.current)}
        >
          <Box align="center">
            <H3>{COPY['withdrawLabel']}</H3>
          </Box>
          <View style={styles.get(['Row', 'LgTopGutter'])}>
            <View style={styles.get(['Flex2', 'RightGutter'])}>
              <Text weight="medium">{fromAccount}</Text>
              {transferType === 'withdraw' ? (
                goalType ? (
                  <Text color="subtle" weight="medium">
                    <Currency>{goalBalances[goalType]}</Currency> available
                  </Text>
                ) : (
                  <React.Fragment>
                    {goalsAvailableForTransfers &&
                      (goalsAvailableForTransfers.length !== 1 ? (
                        <GoalTransferForm
                          items={goalsAvailableForTransfers}
                          initialValues={{
                            targetGoal: goalsAvailableForTransfers[0].id,
                          }}
                        />
                      ) : (
                        <Text weight="medium">
                          {GOAL_ACCOUNTS[formGoalType]}
                        </Text>
                      ))}

                    <Text
                      ml={
                        goalsAvailableForTransfers &&
                        goalsAvailableForTransfers.length === 1
                          ? 0
                          : 1
                      }
                      mt={
                        goalsAvailableForTransfers &&
                        goalsAvailableForTransfers.length === 1
                          ? 0
                          : 1
                      }
                      color="subtle"
                      weight="medium"
                    >
                      <Currency>
                        {goalBalances[goalType] || goalBalances[formGoalType]}
                      </Currency>{' '}
                      available
                    </Text>
                  </React.Fragment>
                )
              ) : null}
            </View>
            <View
              style={styles.get([
                'Flex1',
                Platform.select({ web: undefined, default: 'TopGutter' }),
              ])}
            >
              {transferType === 'withdraw' && (
                <TransferFundsForm
                  formValue={transferAmount}
                  isFormValid={isFormValid}
                  initialValues={{ transferAmount: initialTransferAmount }}
                  transferType={transferType}
                  adjustHeight={
                    !goalType &&
                    goalsAvailableForTransfers &&
                    goalsAvailableForTransfers.length !== 1
                  }
                />
              )}
            </View>
          </View>
        </View>
        <Divider my={4} />
        <View style={styles.get('Margins', breakpoints.current)}>
          <Box align="center">
            <H3>{transferType === 'deposit' ? 'Deposit to' : 'Send to'}</H3>
          </Box>
          <Box my={3} justify="space-between" align="center" row>
            {((!!formGoalType && transferType === 'withdraw') ||
              goalsAvailableForTransfers.length === 1 ||
              !!goalType) && (
              <Text weight="medium" mb={1}>
                {toAccount || GOAL_ACCOUNTS[formGoalType]}
              </Text>
            )}

            {!goalType &&
              transferType === 'deposit' &&
              goalsAvailableForTransfers.length !== 1 && (
                <View
                  style={styles.get(['Flex2', 'RightGutter', 'SmBottomGutter'])}
                >
                  <GoalTransferForm
                    items={goalsAvailableForTransfers}
                    initialValues={{
                      targetGoal: goalsAvailableForTransfers[0].id,
                    }}
                  />
                </View>
              )}

            {transferType === 'deposit' && (
              <View style={styles.get('Flex1')}>
                <TransferFundsForm
                  formValue={transferAmount}
                  isFormValid={isFormValid}
                  initialValues={{ transferAmount: initialTransferAmount }}
                  transferType={transferType}
                  adjustHeight={
                    !goalType &&
                    goalsAvailableForTransfers &&
                    goalsAvailableForTransfers.length !== 1
                  }
                />
              </View>
            )}
          </Box>
        </View>
        {transferType === 'deposit' &&
          depositValidation !== 'OK' &&
          handleDepositValidation({
            primaryAccountBalance,
            transferLimit,
            depositValidation,
            recentDeposits,
          })}
      </ScrollView>
      <View
        style={styles.get(
          ['BottomBar', 'Margins', 'ContainerRow'],
          breakpoints.current,
        )}
      >
        <View style={styles.get('CenterRightRow')}>
          <Button
            viewport={breakpoints.current}
            disabled={
              transferAmount === 0 || isNaN(transferAmount) || !isFormValid
            }
            onClick={onNext}
            wide={breakpoints.select({ PhoneOnly: true })}
          >
            Next
          </Button>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

TransferFundsConfigView.propTypes = {
  breakPoints: PropTypes.object,
  formGoalType: PropTypes.string,
  fromAccount: PropTypes.string,
  goalsAvailableForTransfers: PropTypes.array,
  goalBalances: PropTypes.object,
  goalType: PropTypes.string,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  recentDeposits: PropTypes.number,
  toAccount: PropTypes.string,
  transferLimit: PropTypes.number,
  transferAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  transferType: PropTypes.string.isRequired,
};

const withRedux = connect(state => ({
  transferAmount: formValueSelector('TransferFundsForm')(
    state,
    'transferAmount',
  ),
}));

const Component = withRedux(TransferFundsConfigView);
Component.displayName = 'TransferFundsConfigView';

export default Component;
