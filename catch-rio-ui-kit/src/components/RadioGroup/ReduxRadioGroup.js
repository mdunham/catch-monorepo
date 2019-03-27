import React from 'react';
import RadioGroup from './RadioGroup';

// ReduxRadioGroup wraps the radio group making it work properly with redux form.
const ReduxRadioGroup = ({ input: { onChange, value }, ...rest }) => (
  <RadioGroup onChange={onChange} value={value} {...rest} />
);

export default ReduxRadioGroup;
