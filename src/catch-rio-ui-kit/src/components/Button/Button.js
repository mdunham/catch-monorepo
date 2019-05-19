import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import Spinner from '../Spinner';

import typeStyles from '../../styles';

import {
  fonts,
  colors,
  borderRadius,
  makeHoverVariant,
  makeDisabledVariant,
} from '../../const';
import Hoverable from '../Hoverable';
import Icon from '../Icon';

const styles = StyleSheet.create({
  base: {
    paddingTop: 7,
    paddingRight: 28,
    paddingBottom: 7,
    paddingLeft: 28,
    borderRadius: borderRadius.regular,
    borderWidth: 1,
    borderColor: 'transparent',
    borderStyle: 'solid',
    alignItems: 'center',
    alignSelf: 'auto',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
    flexDirection: 'row',
  },
  PhoneOnly: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  primaryContainer: {
    backgroundColor: colors['ink'],
  },
  primaryContainerHover: {
    backgroundColor: makeHoverVariant(colors['ink']),
  },
  primaryText: {
    color: colors['white'],
  },
  primaryTextHover: {
    color: makeHoverVariant(colors['white']),
  },
  dangerContainer: {
    backgroundColor: colors.danger,
  },
  dangerText: {
    color: colors['white'],
  },
  dangerTextHover: {
    color: makeHoverVariant(colors['white']),
  },
  dangerContainerHover: {
    backgroundColor: makeHoverVariant(colors.danger),
  },
  successContainer: {
    backgroundColor: colors['algae-1'],
  },
  successContainerHover: {
    backgroundColor: makeHoverVariant(colors['algae-1']),
  },
  successText: {
    color: colors['white'],
  },
  successTextHover: {
    color: makeHoverVariant(colors['white']),
  },
  lightContainer: {
    backgroundColor: colors['ink+3'],
  },
  lightContainerHover: {
    backgroundColor: makeHoverVariant(colors['ink+3']),
  },
  lightText: {
    color: colors['ink'],
  },
  lightTextHover: {
    color: makeHoverVariant(colors['ink']),
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderColor: colors['ink'],
  },
  outlineContainerHover: {
    backgroundColor: 'transparent',
    borderColor: makeHoverVariant(colors['ink']),
  },
  outlineText: {
    color: colors['ink'],
  },
  outlineTextHover: {
    color: makeHoverVariant(colors['ink']),
  },
  tertiaryContainer: {
    backgroundColor: '#F5F7FF',
  },
  tertiaryContainerHover: {
    backgroundColor: makeHoverVariant('#F5F7FF'),
  },
  tertiaryText: {
    color: colors['flare'],
  },
  tertiaryTextHover: {
    color: makeHoverVariant(colors['flare']),
  },
  sageContainer: {
    backgroundColor: colors['sage'],
  },
  sageContainerHover: {
    backgroundColor: makeHoverVariant(colors['sage']),
  },
  sageText: {
    color: colors.ink,
  },
  sageTextHover: {
    color: makeHoverVariant(colors.ink),
  },
  small: {
    paddingTop: 4,
    paddingRight: 10,
    paddingBottom: 4,
    paddingLeft: 10,
  },
  narrow: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  wide: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});

const Button = ({
  children,
  disabled,
  outline,
  light,
  tertiary,
  color,
  loading,
  onClick,
  small,
  style,
  wide,
  qaName,
  type,
  viewport,
  smallText,
  icon,
  href,
  ...other
}) => (
  <Hoverable>
    {isHovered => (
      <TouchableOpacity
        disabled={disabled || loading}
        onPress={onClick}
        style={[
          styles.base,
          styles[`${type}Container`],
          isHovered && styles[`${type}ContainerHover`],
          styles[viewport],
          small && styles.small,
          wide && styles.wide,
          smallText && styles.narrow,
          (loading || disabled) && styles.disabled,
          style,
        ]}
        accessibilityLabel={qaName}
        accessibilityRole={Platform.select({
          web: href ? 'link' : 'button',
          default: undefined /* @FIXME rn@0.57.4 release "button" */,
        })}
        href={href}
        target="_blank"
      >
        <Text
          style={typeStyles.get(
            [
              'Body',
              'Medium',
              smallText && 'FieldLabel',
              styles[`${type}Text`],
              isHovered && styles[`${type}TextHover`],
            ],
            viewport,
          )}
        >
          {children}
        </Text>
        {!!icon && <Icon {...icon} />}
      </TouchableOpacity>
    )}
  </Hoverable>
);

export const btnPropTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  onClick: PropTypes.func,
  // TODO: overide opacity rules
  raised: PropTypes.bool,
  loading: PropTypes.bool,
  // TODO: create different types of buttons
  small: PropTypes.bool,
  style: PropTypes.object,
  // Add an icon object prop
  icon: PropTypes.object,
};

Button.propTypes = btnPropTypes;

Button.defaultProps = {
  loading: false,
  onClick: () => {},
  small: false,
  outline: false,
  type: 'primary',
  viewport: 'PhoneOnly',
};

export default Button;
