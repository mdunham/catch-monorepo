import React from 'react';
import Input from '../Input';

/* Redux form abstraction */
const ReduxInput = ({
  input: { name, value, onBlur, onChange, onFocus },
  meta: { touched, error, active },
  submitError, //Error to pass initially if there was an error with form submission
  ...rest
}) => {
  const hasError = touched && typeof error !== 'undefined';
  return (
    <Input
      value={value}
      onChange={onChange}
      onClear={() => onChange('')}
      touched={touched}
      error={hasError ? error : submitError}
      onBlur={onBlur}
      onFocus={onFocus}
      name={name}
      focused={active}
      {...rest}
    />
  );
};

export default ReduxInput;
