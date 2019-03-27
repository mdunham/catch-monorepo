import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import NakedInput from '../NakedInput';
import InputError from '../InputError';
import Box, { Flex } from '../Box';
import Label from '../Label';
import Text from '../Text';
import Caption from '../Caption';
import Icon from '../Icon';
import { colors } from '../../const';

const { flatten, create } = StyleSheet;

const existy = field => !!field;
const onEnter = fn => ({ key }) => (key === 'Enter' ? fn() : undefined);

/**
 * Reusable Input Component for both native and web.
 * TODO: Animations.
 */
const Input = ({
  onClear,
  placeholder,
  value,
  defaultValue,
  error,
  caption,
  name,
  label,
  extraLabel,
  touched,
  clearable,
  confirmable,
  grouped,
  icon,
  showError,
  subLabel,
  ...rest
}) => (
  <Box>
    <Box row justify="space-between">
      {!!label && <Label pb={subLabel ? 0 : 1}>{label}</Label>}
      {isValidElement(extraLabel) ? (
        <Box pb={1}>{extraLabel}</Box>
      ) : (
        !!label && <Caption pb={1}>{extraLabel}</Caption>
      )}
    </Box>
    {!!subLabel && (
      <Text size="small" mb={1}>
        {subLabel}
      </Text>
    )}
    <Box>
      <NakedInput
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        error={!!error}
        onKeyPress={onEnter(onClear)}
        {...rest}
      />
      {clearable &&
        (touched && !!value) && (
          <Icon
            name="clear"
            fill="#333"
            style={flatten([styles.baseIcon, styles.clearIcon])}
          />
        )}
      {confirmable &&
        (touched &&
          !error && (
            <Icon
              name="check"
              fill={colors.success}
              size={16}
              style={flatten([styles.baseIcon, styles.checkIcon])}
            />
          ))}
      {Boolean(icon) && (
        <Icon
          name={icon}
          fill={colors['ink+1']}
          dynamicRules={{ paths: { fill: colors['ink+1'] } }}
          style={flatten([styles.baseIcon, styles.customIcon])}
          size={20}
        />
      )}
    </Box>
    <Box style={{ height: grouped ? 8 : 24 }} justify="center">
      {!!error && showError ? (
        <InputError>{error}</InputError>
      ) : !!caption ? (
        <Caption>{caption}</Caption>
      ) : null}
    </Box>
  </Box>
);

Input.propTypes = {
  defaultValue: PropTypes.string,
  grouped: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  extraLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  touched: PropTypes.bool,
  caption: PropTypes.string,
  id: PropTypes.string,
  multiLine: PropTypes.bool,
  clearable: PropTypes.bool,
  confirmable: PropTypes.bool,
  style: PropTypes.object,
  showError: PropTypes.bool,
};

Input.defaultProps = {
  onChange: () => {},
  onClear: () => {},
  clearable: false,
  confirmable: true,
  grouped: false,
  showError: true,
};

const styles = create({
  baseIcon: {
    position: 'absolute',
  },
  clearIcon: {
    right: 10,
    top: 9,
  },
  checkIcon: {
    right: 10,
    top: 12,
  },
  customIcon: {
    right: 10,
    top: 8,
    opacity: 0.2,
  },
});

export default Input;
