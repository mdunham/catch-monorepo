import React from 'react';
import PropTypes from 'prop-types';
import { Text as RNText, StyleSheet, Platform } from 'react-native';
import { fontColors, fonts, colors } from '../../const';
import { createStyles as createFlexStyles } from '../Box/Box';

const lineHeightMult = 1.4;

const Text = ({
  children,
  onClick,
  style,
  role,
  qaName,
  ariaLevel,
  ...styleProps
}) => {
  const others = StyleSheet.flatten(style);
  const styles = createStyles(styleProps, others);
  return (
    <RNText
      style={[styles.baseText, styles.base, styles.others]}
      onPress={onClick}
      accessibilityRole={role}
      aria-level={ariaLevel}
      accessibilityLabel={qaName}
    >
      {children}
    </RNText>
  );
};

Text.propTypes = {
  /** We can enable all sorts of things through constants here */
  is: PropTypes.string,
  /** An override for the size of the text */
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** If true, center align the text */
  center: PropTypes.bool,
  /** If true, right align the text */
  right: PropTypes.bool,
  /** The content to be rendered */
  children: PropTypes.node,
  /** Adjust the casing of the text */
  textCase: PropTypes.oneOf(['none', 'capitalize', 'lowercase', 'uppercase']),
  /** Color of the text */
  color: PropTypes.string,
  /** Weight/thickness of the text */
  weight: PropTypes.oneOf(['light', 'normal', 'medium', 'semibold', 'bold']),
  /** Optional letter spacing */
  spacing: PropTypes.number,
  /** Optional line height */
  height: PropTypes.number,
  /** Optional handler for when text is clicked */
  onClick: PropTypes.func,
  /** Additional style object to be merged */
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

Text.defaultProps = {
  is: 'div',
  center: false,
  right: false,
  color: 'primary',
  weight: 'normal',
  spacing: 0,
  textCase: 'none',
  italic: false,
  //cursor turns to pointer when provided
  //onClick: () => {},
  selectable: true,
  style: {},
};

// Could be split in another module or file
export const createStyles = (
  {
    center,
    right,
    size,
    is,
    textCase,
    color,
    weight,
    spacing,
    height,
    selectable,
    italic,
    ...other
  },
  others,
) => {
  return StyleSheet.create({
    baseText: {
      ...selectFontStyles({ weight, italic }),
      fontSize: fonts[is] || fonts[size] || size || fonts['body'],
      textAlign: center ? 'center' : right ? 'right' : 'left',
      color: fontColors[color] || colors[color] || color || fontColors.primary,
      letterSpacing: spacing,
      // Seems to only be working on ios :/
      textTransform: textCase,
      lineHeight: height
        ? height * lineHeightMult
        : fonts[is] * lineHeightMult ||
          fonts[size] * lineHeightMult ||
          size * lineHeightMult ||
          fonts['body'] * lineHeightMult,
      ...Platform.select({
        web: {
          userSelect: selectable ? 'auto' : 'none',
        },
      }),
    },
    others,
    // Flex props can be used on Text Component
    ...createFlexStyles(other),
  });
};

/**
 * Native fonts require the use of specific
 * font name for any style whereas web can use the name and specify
 * the styles with additional properties
 */
export const selectFontStyles = Platform.select({
  web: ({ weight, italic }) => ({
    fontFamily: fonts.primary,
    fontWeight: fonts[weight],
    fontStyle: italic ? 'italic' : 'normal',
  }),
  default: ({ weight, italic }) => ({
    fontFamily: italic
      ? fonts.primary[weight === 'normal' ? 'italic' : `${weight}Italic`]
      : fonts.primary[weight],
  }),
});

export default Text;
