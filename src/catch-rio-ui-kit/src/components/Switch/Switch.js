import React from 'react';
import PropTypes from 'prop-types';
import { Switch as RNSwitch } from 'react-native';
import { colors } from '../../const';

const Switch = ({
  isOn,
  onToggle,
  disabled,
  animated,
  activeColor,
  accessible,
  mini,
}) => (
  <RNSwitch
    activeThumbColor={colors.white}
    thumbColor={colors.white}
    trackColor={isOn ? colors.algae : colors['ink+1']}
    onValueChange={onToggle}
    disabled={disabled}
    value={isOn}
    style={mini && { height: 15 }}
  />
);

Switch.propTypes = {
  /** Controls on/off state */
  isOn: PropTypes.bool.isRequired,
  /** Called when changed, passes new value */
  onToggle: PropTypes.func,
  /** Disable changing the value */
  disabled: PropTypes.bool,
  /** Enable/disable animation */
  animated: PropTypes.bool,
  /** Customize the color when switched on. Takes either theme colors ("primary") or primitives ("#667788") */
  activeColor: PropTypes.string,
  /** Renders labels that show the status */
  accessible: PropTypes.bool,
  /** Renders a smaller switch */
  mini: PropTypes.bool,
};

Switch.defaultProps = {
  isOn: false,
  disabled: false,
  activeColor: colors.primary,
};

export default Switch;
