import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Platform, View, TouchableOpacity } from 'react-native';
import Label from '../Label';
import { H2 } from '../Headings';
import Caption from '../Caption';
import Text from '../Text';
import Box from '../Box';
import Icon from '../Icon';
import { shadow } from '../../const';

import Log from '../../util/logger';

function labelToDataTag(label) {
  if (typeof label === 'string') {
    return label
      .split(' ')
      .map(word => word.toLowerCase())
      .join('-');
  }
  return 'formatted-label';
}

const round = (number, increment) => {
  return Math.ceil(number / increment) * increment;
};

const { flatten } = StyleSheet;
/**
 * Steppers increment values by step
 */
const Stepper = ({
  qaName,
  label,
  extraLabel,
  inlineLabel,
  underLabel,
  notNegative,
  children,
  step = 1,
  textWidth,
  disableMax,
  disabled,
  large,
  input: { value, onChange },
}) => {
  const qaLabel = qaName ? (label ? qaName : labelToDataTag(label)) : 'stepper';

  const leftDisabled = (notNegative && value <= 0) || disabled;

  return (
    <React.Fragment>
      {!!label && (
        <Box mb={1}>
          <Label>{label}</Label>
        </Box>
      )}
      {!!extraLabel && (
        <Box pb={2}>
          <Text>{extraLabel}</Text>
        </Box>
      )}
      <Box row align="center" mb={2}>
        <TouchableOpacity
          disabled={leftDisabled}
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() =>
            notNegative && value <= 0 ? {} : onChange(value - step)
          }
          accessibilityLabel={`${qaLabel}-minus`}
        >
          <Icon
            name="minus"
            size={large ? 36 : 25}
            style={[
              styles.icon,
              large && styles.largeIcon,
              leftDisabled && styles.disabled,
            ]}
          />
        </TouchableOpacity>
        <Box align="center" w={textWidth} mx={large ? 4 : 1}>
          {inlineLabel ? (
            <H2 textAlign="center" weight="medium">
              {`${children ? children : value} ${inlineLabel}`}
            </H2>
          ) : (
            <Box>
              <H2
                textAlign="center"
                weight="medium"
                qaName={`${qaLabel}-value`}
                size={large ? 48 : undefined}
              >
                {children ? children : value}
              </H2>
              {!!underLabel && (
                <Text weight="medium" color="link" textAlign="center">
                  {underLabel}
                </Text>
              )}
            </Box>
          )}
        </Box>
        <TouchableOpacity
          hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
          onPress={() => (disableMax ? {} : onChange(value + step))}
          accessibilityLabel={`${qaLabel}-plus`}
        >
          <Icon
            name="plus"
            size={large ? 36 : 25}
            style={flatten([
              styles.icon,
              large && styles.largeIcon,
              disableMax && styles.disabled,
            ])}
          />
        </TouchableOpacity>
      </Box>
    </React.Fragment>
  );
};

Stepper.propTypes = {
  /** Required props for redux-form */
  input: PropTypes.shape({
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number,
  }).isRequired,
  /** If true, stepper can't go negative */
  notNegative: PropTypes.bool,
  /** Optional label to display above the stepper */
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  step: PropTypes.number,
  textWidth: PropTypes.number,
};

Stepper.defaultProps = {
  notNegative: true,
  textWidth: 65,
  large: false,
};

/**
 * Add styles here if needed.
 *
 */
const styles = StyleSheet.create({
  icon: {
    height: 25,
    width: 25,
    ...Platform.select({
      web: { borderRadius: '50%' },
    }),
  },
  largeIcon: {
    height: 36,
    width: 36,
  },
  disabled: {
    opacity: 0.3,
  },
});

export default Stepper;
