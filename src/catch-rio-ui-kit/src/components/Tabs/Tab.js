import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../Text';
import Box from '../Box';
import { colors, fontColors } from '../../const';

/**
 * Tab is just a simple tab with a Label
 */
const Tab = ({
  disabled,
  onClick,
  isActive,
  style,
  children,
  labelProps,
  ...other
}) => {
  const handleClick = () => {
    if (disabled) {
      return;
    }
    onClick();
  };
  return (
    <TouchableOpacity onPress={handleClick} accessible={true}>
      <Box
        pb={14}
        mr={4}
        style={[styles.base, isActive && styles.active, style]}
        {...other}
      >
        <Text
          weight="medium"
          style={[
            styles.baseLabel,
            isActive && styles.activeLabel,
            disabled && styles.disabledLabel,
          ]}
          {...labelProps}
        >
          {children}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

Tab.defaultProps = {
  /** If true, this is the active tab */
  isActive: PropTypes.bool,
  /** If true, the tab will be disabled and unclickable */
  disabled: PropTypes.bool,
  /** The content to be rendered */
  children: PropTypes.node,
  /** The handler for when a Tab is clicked */
  onClick: PropTypes.func,
  /** Pass styles to the box component */
  style: PropTypes.object,
  /** Optional props to pass to underlying Label component */
  labelProps: PropTypes.object,
};

Tab.defaultProps = {
  isActive: false,
  disabled: false,
  labelProps: {},
};

const styles = StyleSheet.create({
  base: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderBottomColor: 'transparent',
  },
  active: {
    borderBottomWidth: 3,
    borderStyle: 'solid',
    borderBottomColor: colors.ink,
  },
  baseLabel: {
    color: colors.gray3,
  },
  disabledLabel: {
    color: colors.gray5,
  },
  activeLabel: {
    color: colors.ink,
  },
});

export default Tab;
