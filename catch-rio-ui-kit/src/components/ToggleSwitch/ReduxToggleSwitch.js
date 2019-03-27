import React from 'react';
import ToggleSwitch from './ToggleSwitch';

const ReduxToggleSwitch = ({
  input: { name, value, onBlur, onChange, onFocus },
  meta: { touched, error, active },
  submitError,
  ...rest
}) => (
  <ToggleSwitch
    switchOn={value}
    onPress={() => onChange(!value)}
    touched={touched}
    name={name}
    focused={active}
    {...rest}
  />
);

export default ReduxToggleSwitch;
