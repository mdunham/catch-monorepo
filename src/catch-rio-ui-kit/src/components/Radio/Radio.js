/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';

import { colors } from '../../const';
import Box from '../Box';
import Divider from '../Divider'

/**
 * Radio buttons are used when a list of two or more options are mutually exclusive,
 * meaning the user must select only one option. Don't forget to use unique ids for each button.
 * If you are looking to toggle options, use a Checkbox instead.
 * TODO: Make sure the color is set according to the theme.
 */
class Radio extends Component {
  static propTypes = {
    /** The content to be rendered */
    children: PropTypes.node,
    /** Customize color */
    color: PropTypes.string,
    /** Disable the input */
    disabled: PropTypes.bool,
    /** Pass arguments up */
    onChange: PropTypes.func,
    /** State of the radio btn */
    checked: PropTypes.bool,
    /** Value to pass up as an argument to onChange */
    value: PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.bool.isRequired,
    ]),

    label: PropTypes.node,
  };
  // Sets a unique id as default
  static defaultProps = {
    checked: false,
  };

  handleChange = () => {
    const { onChange, value } = this.props;
    onChange(value);
  };

  render() {
    const {
      id,
      disabled,
      onChange,
      label,
      style,
      checked,
      children,
      color,
      containerStyle,
      ...other
    } = this.props;
    return (
      <Box {...other}>
        <TouchableOpacity
          style={[styles.container, containerStyle]}
          accessible={true}
          onPress={this.handleChange}>
              <View
                style={[styles.root, checked && styles.borderChecked,  style, disabled && styles.cursorDefault]}

              >
                <View
                  style={[
                    styles.control,
                    checked && styles.controlChecked,
                    checked &&
                      color && { backgroundColor: color, borderColor: color },
                    disabled && styles.controlDisabled,
                    checked && disabled && styles.controlCheckedAndDisabled,
                  ]}
                />
              </View>
              {label}
              {children}
        </TouchableOpacity>
      </Box>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  root: {
    height: 20,
    width: 20,
    borderRadius: 1994,
    borderWidth: 1,
    borderColor: colors.ink,
    borderStyle: 'solid',
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  borderChecked: {
    borderColor: colors.ink,
  },
  cursorDefault: {
    ...Platform.select({
      web: {
        cursor: 'default',
      },
    }),
  },
  control: {
    opacity: 0,
    borderRadius: 1994,
    backgroundColor: colors.ink,
    height: 14,
    width: 14,
    borderWidth: 2,
    borderColor: colors.white,
  },
  controlChecked: {
    opacity: 1,
  },
  controlDisabled: {
    backgroundColor: colors['ink+3'],
  },
  controlCheckedAndDisabled: {
    backgroundColor: colors['ink+3'],
  },
});

export default Radio;
