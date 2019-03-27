import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';

import {
  Box,
  Flex,
  Flag,
  Icon,
  withHover,
  colors,
  borderRadius,
  Paper,
  Divider,
  styles as st,
} from '@catch/rio-ui-kit';

const styles = StyleSheet.create({
  check: {
    height: 13,
    width: 13,
    marginRight: 6,
    marginTop: 5,
  },
  base: {
    backgroundColor: colors.white,
    padding: 24,
    borderRadius: borderRadius.regular,
    borderColor: colors['ink+3'],
    transform: [{ scale: 1 }],
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transitionDuration: '.2s',
      },
    }),
  },
  hover: {
    shadowOpacity: 0.05,
    transform: [{ scale: 0.99, translateZ: 0 }],
  },
  noCursor: Platform.select({
    web: {
      cursor: 'default',
    },
  }),
});

/**
 * PlanCardOption is our suggestion for users to get started
 */
export const PlanCardOption = ({
  title,
  subtitle,
  status,
  onClick,
  onDelete,
  icon,
  qaName,
  isHovered,
  action,
  inactiveVertical,
  triggerInterest,
  isInterested,
  isInterestedText,
  viewport,
  ...other
}) => (
  <TouchableOpacity
    disabled={inactiveVertical}
    onPress={onClick}
    accessibilityLabel={qaName}
  >
    <Paper
      mb={4}
      style={[
        styles.base,
        inactiveVertical && styles.noCursor,
        !inactiveVertical && isHovered && styles.hover,
      ]}
      {...other}
    >
      <Box row align="flex-start" justify="space-between">
        {status && (
          <Flag type={inactiveVertical ? 'comingSoon' : 'active'}>
            {status}
          </Flag>
        )}

        {!!onDelete && (
          <Icon
            name="close"
            fill={colors.gray4}
            stroke={colors.gray4}
            strokeWidth="3px"
            size={11}
            onClick={onDelete}
            style={{ position: 'absolute' }}
          />
        )}
      </Box>
      <Box row wrap align="flex-end" mt={1}>
        <Box mr={2} mb={4.5}>
          <Icon name={icon} size={40} />
        </Box>
        <Box auto justify="space-between">
          {!inactiveVertical && (
            <Text style={st.get('FinePrint', viewport)}>{action}</Text>
          )}
          <Text style={st.get('H4S', viewport)}>{title}</Text>
        </Box>
      </Box>
      <Box pr={3} mt={1}>
        <Text style={st.get('Body', viewport)}>{subtitle}</Text>
      </Box>
      {inactiveVertical && (
        <Box mt={2}>
          <Divider />
          <Box mt={2}>
            {isInterested ? (
              <Box row>
                <Icon name="check" style={styles.check} fill={colors.grass} />
                <Text style={st.get('FinePrint', viewport)}>
                  {isInterestedText}
                </Text>
              </Box>
            ) : (
              <Text
                style={st.get('FinePrintLink', viewport)}
                onPress={triggerInterest}
              >
                Interested?
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  </TouchableOpacity>
);

PlanCardOption.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string.isRequired,
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]).isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  isHovered: PropTypes.bool,
  triggerInterest: PropTypes.func,
  inactiveVertical: PropTypes.bool,
};

PlanCardOption.defaultProps = {
  inactiveVertical: false,
};

export default withHover(PlanCardOption);
