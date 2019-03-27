import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, Platform } from 'react-native';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Icon,
  animations,
  colors,
  shadow,
  styles as st,
} from '@catch/rio-ui-kit';
import { Percentage, FullDate, Currency } from '@catch/utils';

export const styles = {
  base: {
    backgroundColor: colors.white,
    borderRadius: 0,
    borderColor: '#EBECEE',
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 4,
    borderRightWidth: 0.5,
    borderLeftWidth: 0.5,
  },
  start: {
    borderTopWidth: 0.5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  end: {
    borderBottomWidth: 0.5,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    marginBottom: 21,
  },
  transition: {
    ...Platform.select({
      web: {
        ...animations.fadeInUp,
      },
    }),
  },
  faded: {
    opacity: 0.6,
  },
  divider: {
    flex: 1,
    borderBottomWidth: 1,
    // Sage
    borderBottomColor: 'rgba(206,225,229,0.7)',
  },
};

const PREFIX = 'catch.plans.ActivityCard';
export const COPY = {
  // @TODO
  depositCaption: values => (
    <FormattedMessage id={`${PREFIX}.depositCaption`} values={values} />
  ),
  goalCaption: values => (
    <FormattedMessage id={`${PREFIX}.goalCaption`} values={values} />
  ),
  referralCaption: <FormattedMessage id={`${PREFIX}.referralCaption`} />,
};

const isPending = status =>
  status === 'INCOME_ACTION_APPROVED' ||
  status === 'INCOME_ACTION_EXECUTED' ||
  status === 'PROCESSING' ||
  status === 'TRANSACTION_STATUS_PENDING';

// @TODO Should figure out a stronger formatting game for transactions
const amountSign = type => {
  switch (type) {
    case 'deposit':
      return '+';
    case 'withdrawal':
      return '-';
    case 'referral-bonus':
      return '+';
    default:
      return '';
  }
};

const iconProps = type => {
  const props = {
    name: 'plan-plus',
    size: 11,
  };
  switch (type) {
    case 'referral-bonus':
      props.name = 'gift';
      props.fill = colors['algae'];
      props.size = 18;
      props.dynamicRules = {
        paths: {
          fill: colors['algae'],
        },
      };
      break;
    case 'deposit':
      props.name = 'deposit-arrow';
      break;
    case 'withdrawal':
      props.name = 'withdrawal-arrow';
      break;
    case 'new-plan':
      props.name = 'plan-plus';
      props.size = 14;
      props.fill = '#B1B7C4';
      props.dynamicRules = {
        paths: {
          fill: '#B1B7C4',
        },
      };
      break;
    default:
      return 'plan-plus';
  }
  return props;
};

const noop = () => {};

const ActivityCard = ({
  type,
  depositType,
  date,
  amount,
  total,
  status,
  bankReference,
  onPress,
  goalName,
  percentage,
  isStart,
  isEnd,
  viewport,
}) => (
  <TouchableOpacity
    onPress={depositType && depositType === 'REWARD' ? noop : onPress}
    disabled={type === 'new-plan'}
  >
    <Box
      style={[
        styles.base,
        isStart && styles.start,
        isEnd && styles.end,
        type !== 'withdrawal' && isPending(status) && styles.faded,
      ]}
      row
      align="center"
    >
      <Box p={3}>
        <Icon {...iconProps(type)} />
      </Box>
      <Box mr={4} py={20} style={[!isEnd && styles.divider]}>
        <Text style={st.get(['H6', 'SmBottomGutter', 'SubtleText'], viewport)}>
          {isPending(status) && type !== 'withdrawal' ? (
            'PROCESSING'
          ) : (
            <FullDate uppercase>{date}</FullDate>
          )}
        </Text>
        {goalName ? (
          <Text style={st.get(['FinePrint', 'SmBottomGutter'], viewport)}>
            {COPY['goalCaption']({ goalName })}
          </Text>
        ) : (
          <Text
            style={st.get(['FinePrint', 'Bold', 'SmBottomGutter'], viewport)}
          >
            {amountSign(type)}{' '}
            <Currency>{amount < 0 ? amount * -1 : amount}</Currency>
          </Text>
        )}
        {percentage ? (
          <Text style={st.get('FinePrint', viewport)}>
            <Percentage whole>{percentage}</Percentage> paycheck
          </Text>
        ) : (
          <Text style={st.get('FinePrint', viewport)}>
            {type === 'deposit'
              ? depositType === 'INCOME'
                ? COPY['depositCaption']({
                    amount: <Currency>{total}</Currency>,
                  })
                : depositType === 'REWARD'
                  ? 'From Catch Rewards'
                  : `From ${bankReference}`
              : type === 'referral-bonus'
                ? COPY['referralCaption']
                : `To ${bankReference}`}
          </Text>
        )}
      </Box>
    </Box>
  </TouchableOpacity>
);

export default ActivityCard;
