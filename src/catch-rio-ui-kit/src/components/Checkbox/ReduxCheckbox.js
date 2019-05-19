import React from 'react';
import CheckboxField from './CheckboxField';

const ReduxCheckbox = ({ input: { onChange, value }, ...rest }) => (
  <CheckboxField
    onChange={() => onChange(!value)}
    checked={Boolean(value)}
    {...rest}
  />
);

export default ReduxCheckbox;
