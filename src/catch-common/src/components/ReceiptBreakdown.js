import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IntercomAPI } from 'react-intercom';
import { View, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';

import { Box, Text, Divider, colors, styles as st } from '@catch/rio-ui-kit';
import {
  Percentage,
  Currency,
  FullDate,
  NumericDate,
  ShortDate,
} from '@catch/utils';

import { GOAL_ACCOUNTS } from '../utils';

const styles = StyleSheet.create({
  income: {
    backgroundColor: colors['ink+4'],
  },
});

const isPending = status =>
  status === 'INCOME_ACTION_APPROVED' ||
  status === 'INCOME_ACTION_EXECUTED' ||
  status === 'PROCESSING' ||
  status === 'TRANSACTION_STATUS_PENDING';

const PREFIX = 'catch.plans.ReceiptBreakdown';
export const COPY = {
  txTitle: values => (
    <FormattedMessage id={`${PREFIX}.txTitle`} values={values} />
  ),
  wdTitle: values => (
    <FormattedMessage id={`${PREFIX}.wdTitle`} values={values} />
  ),
  txSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.txSubtitle`} values={values} />
  ),
  wdSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.wdSubtitle`} values={values} />
  ),
  paycheckLabel: <FormattedMessage id={`${PREFIX}.paycheckLabel`} />,
  paycheckLabel1099: <FormattedMessage id={`${PREFIX}.paycheckLabel1099`} />,
  paycheckLabelW2: <FormattedMessage id={`${PREFIX}.paycheckLabelW2`} />,
  paycheckName: <FormattedMessage id={`${PREFIX}.paycheckName`} />,
  planLabel: <FormattedMessage id={`${PREFIX}.planLabel`} />,
  paycheckDateText: values => (
    <FormattedMessage id={`${PREFIX}.paycheckDateText`} values={values} />
  ),
  // Implement when backend expose this
  savingsDateText: values => (
    <FormattedMessage id={`${PREFIX}.savingsDateText`} values={values} />
  ),
  totalText: <FormattedMessage id={`${PREFIX}.totalText`} />,
  helpLabel: <FormattedMessage id={`${PREFIX}.helpLabel`} />,
  helpLink: <FormattedMessage id={`${PREFIX}.helpLink`} />,
  TAX: <FormattedMessage id={`${PREFIX}.TAX`} />,
  PTO: <FormattedMessage id={`${PREFIX}.PTO`} />,
  RETIREMENT: <FormattedMessage id={`${PREFIX}.RETIREMENT`} />,
  contribution: <FormattedMessage id={`${PREFIX}.contribution`} />,
  contributionTo: values => (
    <FormattedMessage id={`${PREFIX}.contributionTo`} values={values} />
  ),
  savings: <FormattedMessage id={`${PREFIX}.savings`} />,
  investments: <FormattedMessage id={`${PREFIX}.investments`} />,
  totalWithdrawn: <FormattedMessage id={`${PREFIX}.totalWithdrawn`} />,
};

const goalTitles = {
  TAX: 'Taxes',
  PTO: 'Time off',
  RETIREMENT: 'Retirement',
};

const PAYCHECK_LABELS = {
  PAYCHECK_TYPE_1099: COPY['paycheckLabel1099'],
  PAYCHECK_TYPE_W2: COPY['paycheckLabelW2'],
};

/**
 * @NOTE We can do the different breakdown statuses when retirement works
 * right now it's not necessary as they're handled as the same time
 */
const ReceiptBreakdown = ({
  txStatus,
  paycheckID,
  account,
  paycheckDate,
  paycheckAmount,
  breakdowns,
  total,
  type,
  isMobile,
  createdOn,
  savingsBreakdowns,
  investmentBreakdowns,
  goalType,
  depositType,
  bankReference,
  savingsExpectedDate,
  wealthExpectedDate,
  savingsTransactionIsPending,
  wealthTransactionIsPending,
  completionDate,
  expectedDate,
  paycheckType,
  savingsCompletionDate,
  wealthCompletionDate,
}) => (
  <ScrollView>
    <View
      style={st.get(['ModalMax', 'BottomGutter'])}
      onStartShouldSetResponder={() => true}
    >
      <Box mb={3} px={3} pt={1}>
        {type === 'deposit' &&
          depositType === 'INCOME' && (
            <Box mb={1}>
              <Text size="large" weight="bold">
                <Text size="large" weight="bold" color="algae">
                  <Currency>{total}</Currency>
                </Text>{' '}
                {goalType
                  ? COPY['contributionTo']({ vertical: COPY[goalType] })
                  : COPY['contribution']}
              </Text>
            </Box>
          )}
        <Text>
          {type === 'deposit' ? (
            depositType === 'INCOME' ? (
              <React.Fragment>
                <Text>Transfer initiated</Text>{' '}
                <NumericDate>{createdOn}</NumericDate>
              </React.Fragment>
            ) : (
              <Text mb={1} weight="bold">
                <Text color="algae" weight="bold">
                  <Currency>{total}</Currency>
                </Text>
                {` transfer to ${GOAL_ACCOUNTS[goalType.toUpperCase()]}`}
              </Text>
            )
          ) : (
            COPY['wdTitle']({ number: paycheckID })
          )}
        </Text>
        {type === 'deposit' &&
          depositType === 'DEPOSIT' && (
            <Text mt={1}>
              Initiated <NumericDate>{paycheckDate}</NumericDate>
            </Text>
          )}
        <Text mt={1}>
          {type === 'deposit'
            ? depositType === 'INCOME'
              ? COPY['txSubtitle']({ account })
              : null
            : COPY['wdSubtitle']({ account })}
        </Text>
      </Box>

      {type === 'deposit' ? (
        depositType === 'INCOME' ? (
          <Box>
            <Box style={styles.income} mb={4} px={3} py={2}>
              <Text weight="bold" color="ink">
                {PAYCHECK_LABELS[paycheckType]}
              </Text>

              <Box row mt={1} justify="space-between">
                <Text>
                  <ShortDate>{paycheckDate}</ShortDate> {COPY['paycheckName']}
                </Text>
                <Text>
                  <Currency>{paycheckAmount}</Currency>
                </Text>
              </Box>
            </Box>
            {savingsBreakdowns &&
              savingsBreakdowns.length > 0 && (
                <Box px={3}>
                  <Box row justify="space-between" mb={1}>
                    <Text weight="bold">{COPY['savings']}</Text>
                    <Box>
                      {type === 'deposit' ? (
                        <Text
                          size="small"
                          weight="medium"
                          color={savingsTransactionIsPending ? 'ink+2' : 'ink'}
                          mb={1}
                        >
                          {savingsTransactionIsPending
                            ? `EXPECTED ${format(
                                savingsExpectedDate,
                                'MM/DD/YYYY',
                              )}`
                            : `DEPOSITED ${format(
                                savingsCompletionDate,
                                'MM/DD/YYYY',
                              )}`}
                        </Text>
                      ) : (
                        <Text
                          size="small"
                          weight="medium"
                          color={isPending(txStatus) ? 'ink+2' : 'ink'}
                          mb={1}
                        >
                          {isPending(txStatus) ? 'INITIATED' : 'WITHDRAWN'}{' '}
                          <FullDate>{paycheckDate}</FullDate>
                        </Text>
                      )}
                    </Box>
                  </Box>
                  {savingsBreakdowns.map((goal, key) => (
                    <Box row key={goal.id} pb={1} justify="space-between">
                      {type === 'deposit' ? (
                        <Text>
                          {COPY[goal.type]} (
                          <Percentage whole>{goal.percentage}</Percentage>){' '}
                        </Text>
                      ) : (
                        <Text>{goalTitles[goal.goalType]}</Text>
                      )}
                      <Text color="ink">
                        <Currency>{goal.amount}</Currency>
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}

            {investmentBreakdowns &&
              investmentBreakdowns.length > 0 && (
                <Box mt={2} px={3}>
                  <Box row justify="space-between" mb={1}>
                    <Text weight="bold">{COPY['investments']}</Text>
                    <Box>
                      {type === 'deposit' ? (
                        <Text
                          size="small"
                          weight="medium"
                          color={wealthTransactionIsPending ? 'ink+2' : 'ink'}
                          mb={1}
                        >
                          {wealthTransactionIsPending
                            ? `EXPECTED ${format(
                                wealthExpectedDate,
                                'MM/DD/YYYY',
                              )}`
                            : `INVESTED ${format(
                                wealthCompletionDate,
                                'MM/DD/YYYY',
                              )}`}
                        </Text>
                      ) : (
                        <Text
                          size="small"
                          weight="medium"
                          color={isPending(txStatus) ? 'ink+2' : 'ink'}
                          mb={1}
                        >
                          {isPending(txStatus) ? 'INITIATED' : 'WITHDRAWN'}{' '}
                          <FullDate>{paycheckDate}</FullDate>
                        </Text>
                      )}
                    </Box>
                  </Box>
                  {investmentBreakdowns.map((goal, key) => (
                    <Box row key={goal.id} pb={1} justify="space-between">
                      {type === 'deposit' ? (
                        <Text>
                          {COPY[goal.type]} (
                          <Percentage whole>{goal.percentage}</Percentage>){' '}
                        </Text>
                      ) : (
                        <Text>{goalTitles[goal.goalType]}</Text>
                      )}
                      <Text color="ink">
                        <Currency>{goal.amount}</Currency>
                      </Text>
                    </Box>
                  ))}
                </Box>
              )}
          </Box>
        ) : (
          <Box px={3}>
            <Text mb={1} weight="bold">
              From:
            </Text>
            <Text mb={3}>{bankReference}</Text>

            <Divider />

            <Text mt={3} mb={1} weight="bold">
              To:
            </Text>
            {goalType && (
              <Box mb={3} row justify="space-between">
                <Text mb={1}>{GOAL_ACCOUNTS[goalType.toUpperCase()]}</Text>
                {depositType === 'DEPOSIT' && (
                  <Box justify="flex-end">
                    <Text ml="auto" weight="bold">
                      <Currency>{total}</Currency>
                    </Text>
                    <Text
                      mt={1}
                      size="tiny"
                      weight="medium"
                      color={isPending(txStatus) ? 'ink+2' : 'ink'}
                      mb={1}
                    >{`${
                      isPending(txStatus)
                        ? 'EXPECTED'
                        : goalType === 'retirement'
                          ? 'INVESTED'
                          : 'DEPOSITED'
                    } ${format(
                      isPending(txStatus) ? expectedDate : completionDate,
                      'MM/DD/YYYY',
                    )}`}</Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        )
      ) : (
        <Box mt={2} px={3}>
          <Box row justify="space-between" mb={1}>
            <Text weight="bold">{COPY['savings']}</Text>
            <Box>
              <Text
                size="small"
                weight="medium"
                color={isPending(txStatus) ? 'ink+2' : 'ink'}
                mb={1}
              >
                {isPending(txStatus) ? 'INITIATED' : 'WITHDRAWN'}{' '}
                <FullDate>{paycheckDate}</FullDate>
              </Text>
            </Box>
          </Box>
          {breakdowns.map((goal, key) => (
            <Box row key={goal.id} pb={2} justify="space-between">
              <Text>{goalTitles[goal.goalType]}</Text>

              <Text>
                <Currency>{goal.amount}</Currency>
              </Text>
            </Box>
          ))}
        </Box>
      )}
      {((type === 'deposit' && depositType === 'INCOME') ||
        type === 'withdrawal') && (
        <Box px={3}>
          <Divider mt={2} />

          <Box row my={2} justify="space-between" mb={4}>
            <Text size="large" weight="bold">
              {type === 'deposit'
                ? depositType === 'DEPOSIT'
                  ? 'Total deposit'
                  : COPY['totalText']
                : COPY['totalWithdrawn']}
            </Text>
            <Box justify="flex-end">
              <Text
                ml="auto"
                size="large"
                weight="bold"
                color={type === 'withdrawal' ? 'algae' : 'ink'}
              >
                <Currency>{total}</Currency>
              </Text>
              {isPending(txStatus)
                ? expectedDate && (
                    <Text
                      size="tiny"
                      weight="medium"
                      color="ink+2"
                      mb={1}
                    >{`EXPECTED ${format(expectedDate, 'MM/DD/YYYY')}`}</Text>
                  )
                : depositType === 'DEPOSIT' && (
                    <Text size="tiny" weight="medium" mb={1}>{`${
                      type === 'deposit' ? 'DEPOSITED' : 'COMPLETED'
                    } ${format(completionDate, 'MM/DD/YYYY')}`}</Text>
                  )}
            </Box>
          </Box>
        </Box>
      )}

      <Box align="center" mb={2}>
        <Text size="small" color="gray2" center>
          {COPY['helpLabel']}
        </Text>
        <Text
          size="small"
          color="link"
          weight="medium"
          // https://developers.intercom.com/installing-intercom/docs/intercom-javascript#section-intercomshow
          onClick={() => IntercomAPI('show')}
          center
        >
          {COPY['helpLink']}
        </Text>
      </Box>
    </View>
  </ScrollView>
);

export default ReceiptBreakdown;
