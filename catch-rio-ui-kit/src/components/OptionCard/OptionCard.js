import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, TouchableOpacity } from 'react-native';

import Text from '../Text';
import Box from '../Box';
import { borderRadius, colors, shadow } from '../../const';
import { withHover } from '../Hoverable';
import Icon from '../Icon';
import Radio from '../Radio';

const styles = {
  base: {
    backgroundColor: colors.snow,
    borderRadius: borderRadius.regular,
    padding: 16,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors['ink+3'],
    ...Platform.select({
      web: {
        transform: [{ scale: 1 }],
        transitionProperty: 'transform',
        transitionDuration: '300ms',
        // TODO: tweak with design team, it looks
        // quite trippy at the moment.
        transitionTimingFunction: 'cubic-bezier(.32,.12,.24,1)',
      },
    }),
  },
  simple: {
    borderColor: 'transparent',
    backgroundColor: colors['peach+1'],
    paddingTop: 10,
    paddingBottom: 10,
  },
  checked: {
    borderColor: colors.ink,
  },
  simpleChecked: {
    backgroundColor: colors['peach-1'],
    borderColor: 'transparent',
  },
  hovered: {
    backgroundColor: colors['peach'],
  },
  // can add a general hover on a group
  // and make other elements fade out a bit
  background: {
    opacity: 0.4,
  },
  checkMark: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    paddingTop: 5,
  },
};

export class OptionCard extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    checked: PropTypes.bool,
    simple: PropTypes.bool,
    isHovered: PropTypes.bool,
    isBackground: PropTypes.bool,
    pseudoDisabled: PropTypes.bool,
    viewport: PropTypes.string.isRequired,
    checkMark: PropTypes.bool,
  };
  static defaultProps = {
    checked: false,
    disabled: false,
    simple: false,
    isHovered: false,
    isBackground: false,
    viewport: 'desktopUp',
  };

  handlePress = () => {
    const { onChange, onClick, value, disabled } = this.props;
    if (disabled) {
      return;
    }
    if (onChange) {
      onChange(value);
    }
    if (onClick) {
      onClick();
    }
  };

  renderCard = () => {
    const {
      children,
      disabled,
      pseudoDisabled,
      onClick,
      checked,
      simple,
      isHovered,
      isBackground,
      style,
      radio,
      title,
      subtitle,
      hoverEnabled,
      checkMark,
      ...rest
    } = this.props;

    return (
      <Box
        style={[
          styles.base,
          simple && styles.simple,
          !disabled && hoverEnabled && isHovered && styles.hovered,
          pseudoDisabled && hoverEnabled && isHovered && styles.base,
          checked && styles.checked,
          checked && simple && styles.simpleChecked,
          isBackground && styles.background,
          style,
        ]}
        {...rest}
      >
        {simple ? (
          <Box w={1} row align="center" justify="center" pr={1}>
            <Box>
              <Text center weight="bold" selectable={false}>
                {title}
              </Text>
              {!!subtitle && (
                <Text center color={checked ? 'rgba(0,0,0,0.7)' : undefined}>
                  {subtitle}
                </Text>
              )}
            </Box>
            {checkMark &&
              checked && (
                <Box ml={3} style={styles.checkMark}>
                  <Icon
                    name="check"
                    dynamicRules={{
                      paths: { fill: colors.ink },
                    }}
                    fill={colors.ink}
                    size={18}
                  />
                </Box>
              )}
          </Box>
        ) : radio ? (
          <Box row align="center" w={1}>
            <Radio checked={checked} onChange={this.handlePress} value={''} />
            <Box ml={2}>
              <Text
                weight="medium"
                color={disabled ? colors['ink+1'] : colors.ink}
                height={18}
              >
                {title}
              </Text>
              {!!subtitle && <Text size="small">{subtitle}</Text>}
            </Box>
          </Box>
        ) : (
          children
        )}
      </Box>
    );
  };

  render() {
    const {
      children,
      disabled,
      pseudoDisabled,
      onClick,
      checked,
      simple,
      isHovered,
      isBackground,
      style,
      viewport,
      ...rest
    } = this.props;

    return (
      <TouchableOpacity accessible={true} onPress={this.handlePress}>
        {this.renderCard()}
      </TouchableOpacity>
    );
  }
}

export default withHover(OptionCard);
