import React from 'react';
import PropTypes from 'prop-types';
import { TextInput, StyleSheet } from 'react-native';
import { fonts, fontColors, colors, borderRadius } from '../../const';

import { selectFontStyles } from '../Text';

const NakedInput = ({
  focused,
  alert,
  multiLine,
  style,
  value,
  error,
  rows,
  white,
  type,
  myRef,
  qaName,
  onSubmit,
  onKeyPress,
  signature,
  ...rest
}) => (
  <TextInput
    ref={input => {
      if (myRef) myRef(input);
    }}
    value={value}
    multiline={multiLine}
    numberOfLines={rows}
    placeholderTextColor={colors.gray3}
    autoCapitalize="none"
    secureTextEntry={type === 'password'}
    style={[
      styles.base,
      white && styles.white,
      error && styles.error,
      focused && styles.focused,
      alert && styles.alert,
      signature && styles.signature,
      style,
    ]}
    accessibilityLabel={qaName}
    onKeyPress={({ nativeEvent: { key } }) =>
      key === 'Enter' ? onSubmit() : onKeyPress(key)
    }
    {...rest}
  />
);

NakedInput.propTypes = {
  multiLine: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  value: PropTypes.string,
  error: PropTypes.bool,
  rows: PropTypes.number,
  type: PropTypes.string,
  white: PropTypes.bool,
};

NakedInput.defaultProps = {
  multiLine: false,
  value: '',
  white: false,
  onKeyPress: () => {},
  onSubmit: () => {},
};

const styles = StyleSheet.create({
  base: {
    color: fontColors.primary,
    backgroundColor: colors['snow'],
    borderRadius: borderRadius.regular,
    fontFamily:
      typeof fonts.primary === 'string'
        ? fonts.primary
        : fonts.primary['normal'],
    fontSize: fonts.body,
    padding: 10,
    borderWidth: 1,
    borderStyle: 'solid',
    width: '100%',
    borderColor: colors['ink+3'],
  },
  white: {
    backgroundColor: colors.white,
    borderColor: colors.gray5,
    borderWidth: 0.5,
  },
  error: {
    borderColor: colors['coral-1'],
  },
  focused: {
    borderColor: colors.flare,
  },
  alert: {
    borderColor: colors.coral,
  },
  signature: {
    fontFamily:
      typeof fonts.signature === 'string'
        ? fonts.signature
        : fonts.signature.normal,
    fontSize: 32,
    paddingTop: 16,
  },
});

export default NakedInput;
