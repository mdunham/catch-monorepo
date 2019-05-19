import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  createElement,
  TouchableOpacity,
  Platform,
} from 'react-native';

import { colors } from '../../const';

class Checkbox extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    onValueChange: PropTypes.func,
    value: PropTypes.bool,
  };

  static defaultProps = {
    disabled: false,
    value: false,
  };

  render() {
    const {
      color,
      borderColor,
      disabled,
      onChange,
      onValueChange,
      style,
      value,
      qaName,
      ...other
    } = this.props;

    const fakeEvent = {
      nativeEvent: {
        target: {
          checked: !value,
        },
      },
      target: {
        checked: !value,
      },
    };

    const fakeControl = [
      <View
        key="check-bg"
        style={[
          styles.fakeControl,
          value && styles.fakeControlChecked,
          // custom color
          borderColor && { borderColor },
          value && color && { backgroundColor: color, borderColor: color },
          disabled && styles.fakeControlDisabled,
          value && disabled && styles.fakeControlCheckedAndDisabled,
        ]}
      />,
      <View
        key="check-mark"
        style={[styles.checkMark, value && styles.checkMarkChecked]}
      />,
    ];

    return (
      <TouchableOpacity
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
        disabled={Platform.OS === 'web'}
        onPress={() => this._handleChange(fakeEvent)}
        accessibilityLabel={qaName}
        {...other}
        style={[styles.root, style, disabled && styles.cursorDefault]}
      >
        {fakeControl}
        {/* For accessibility */
        Platform.OS === 'web' && this._renderWebControl()}
      </TouchableOpacity>
    );
  }

  _handleChange = event => {
    const { onChange, onValueChange } = this.props;
    const value = event.nativeEvent.target.checked;
    event.nativeEvent.value = value;
    onChange && onChange(event);
    onValueChange && onValueChange(value);
  };

  _setCheckboxRef = element => {
    this._checkboxElement = element;
  };

  _renderWebControl = _ => {
    const { value, disabled } = this.props;
    return createElement('input', {
      checked: value,
      disabled: disabled,
      onChange: this._handleChange,
      ref: this._setCheckboxRef,
      style: [styles.nativeControl, styles.cursorInherit],
      type: 'checkbox',
    });
  };
}

const styles = StyleSheet.create({
  root: {
    ...Platform.select({ web: { cursor: 'pointer', userSelect: 'none' } }),
    height: 16,
    width: 16,
    position: 'relative',
  },
  cursorDefault: {
    ...Platform.select({ web: { cursor: 'default' } }),
  },
  cursorInherit: {
    ...Platform.select({ web: { cursor: 'inherit' } }),
  },
  fakeControl: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: colors.ink,
    borderRadius: 3,
    borderStyle: 'solid',
    borderWidth: 1,
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
  fakeControlChecked: {
    backgroundColor: '#009688',
    borderColor: '#009688',
  },
  fakeControlDisabled: {
    borderColor: '#CCD6DD',
  },
  fakeControlCheckedAndDisabled: {
    backgroundColor: '#AAB8C2',
    borderColor: '#AAB8C2',
  },
  nativeControl: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    margin: 0,
    opacity: 0,
    padding: 0,
    width: '100%',
  },
  checkMark: {
    position: 'absolute',
    top: 3,
    left: 3,
    height: 6,
    width: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    transform: [{ rotate: '-45deg' }],
    opacity: 0,
  },
  checkMarkChecked: {
    opacity: 1,
  },
});

export default Checkbox;
