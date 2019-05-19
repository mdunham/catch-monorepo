import React from 'react';
import Slider from './Slider';

// ReduxSlider wraps the slider component making it work properly with redux form.
const ReduxSlider = ({ input: { onChange, value }, ...rest }) => (
  <Slider onChange={onChange} value={value} {...rest} />
);

export default ReduxSlider;
