import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { formatCurrency, Percentage } from '@catch/utils';
import {
  Box,
  Text,
  H2,
  Divider,
  Icon,
  Paper,
  colors,
  Flag,
  styles,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.plans.PlanDetailCard';

export const COPY = {
  taxDropdown: <FormattedMessage id={`${PREFIX}.taxDropdown`} />,
  retirementDropdown: <FormattedMessage id={`${PREFIX}.retirementDropdown`} />,
};

const growthColors = {
  UP: colors['algae+1'],
  DOWN: colors.coral,
  NEUTRAL: colors['ink+2'],
};

const PlanDetailCard = ({
  children,
  title,
  icon,
  onEdit,
  onTransfer,
  balance,
  paycheckPercentage,
  daysNumber,
  isOpen,
  goalType,
  onToggleDetails,
  growth,
  showGrowth,
  growthDirection,
  isAccountReady,
  goalStatus,
  viewport,
  breakpoints,
  accountFullyFunded,
}) => (
  <Paper
    flat={viewport === 'PhoneOnly'}
    w={1}
    p={3}
    py={5}
    mb={breakpoints.select({ 'TabletPortraitUp|TabletLandscapeUp': 3 })}
    style={styles.get('ContentMax')}
  >
    {goalStatus === 'PAUSED' && (
      <Box w={1}>
        <Box absolute style={{ top: -50, left: 0, right: 0 }} align="center">
          <View>
            <Flag type="paused" mt={2}>
              paused
            </Flag>
          </View>
        </Box>
      </Box>
    )}
    <Box
      align="center"
      style={goalStatus === 'PAUSED' ? { opacity: 0.5 } : undefined}
    >
      <Icon name={icon} size={50} />
      <H2 mt={1}>{title}</H2>
      {!accountFullyFunded &&
        (goalType === 'pto' ? (
          <Text
            size="large"
            weight="medium"
            color="link"
            onClick={onEdit}
            mt={7}
          >
            {daysNumber} days off this year
          </Text>
        ) : (
          <Text
            size="large"
            weight="medium"
            color="link"
            onClick={onEdit}
            mt={7}
          >
            <Percentage whole>{paycheckPercentage}</Percentage> per paycheck
          </Text>
        ))}
      {goalType === 'pto' && (
        <Text weight="medium" color="gray3" onClick={onEdit} mt={1}>
          <Percentage whole>{paycheckPercentage}</Percentage> per paycheck
        </Text>
      )}
      {!!accountFullyFunded && (
        <Text my={1} size={16} color="algae+1" weight="medium">
          Fully funded
        </Text>
      )}
    </Box>
    <Divider my={4} />
    <Box align="center">
      <H2>
        {balance
          ? balance > 0
            ? formatCurrency(balance.toFixed(2))
            : formatCurrency(0)
          : formatCurrency(0)}
      </H2>
      {showGrowth && (
        <Box my={1} row>
          <Box mt={6} mr={6}>
            <Icon
              fill={growthColors[growthDirection]}
              dynamicRules={{ paths: { fill: growthColors[growthDirection] } }}
              size={12}
              name="triangle"
              style={{
                transform: growthDirection === 'DOWN' && [
                  { rotate: '180deg', translateY: 6 },
                ],
              }}
            />
          </Box>
          <Text>
            <Percentage>{Math.abs(growth / 100)}</Percentage>
          </Text>
        </Box>
      )}
      {onTransfer &&
        isAccountReady &&
        !accountFullyFunded && (
          <Text color="link" weight="medium" onClick={onTransfer} mt={9}>
            Transfer funds
          </Text>
        )}
    </Box>
    {(goalType === 'tax' || goalType === 'retirement') &&
      viewport !== 'PhoneOnly' && (
        <React.Fragment>
          <Divider my={4} />
          <Box align="center" justify="center" row>
            <Icon
              name="right"
              stroke={colors.primary}
              fill={colors.primary}
              dynamicRules={{ paths: { fill: colors.primary } }}
              size={12}
              style={isOpen ? { transform: [{ rotate: '90deg' }] } : undefined}
              onClick={onToggleDetails}
            />
            <Text weight="medium" ml={1} onClick={onToggleDetails}>
              {COPY[`${goalType}Dropdown`]}
            </Text>
          </Box>
          {isOpen && children}
        </React.Fragment>
      )}
  </Paper>
);

PlanDetailCard.defaultProps = {
  accountFullyFunded: false,
};

export default PlanDetailCard;
