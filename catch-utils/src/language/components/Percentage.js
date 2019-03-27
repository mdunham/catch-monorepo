import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

const Percentage = ({ children, whole, ...other }) => {
  return (
    <FormattedNumber
      minimumFractionDigits={whole ? 0 : 2}
      maximumFractionDigits={whole ? 0 : 2}
      value={children}
      style="percent"
      {...other}
    />
  );
};
Percentage.propTypes = {
  children: PropTypes.node,
  whole: PropTypes.bool,
};
Percentage.defaultProps = {
  whole: false,
};
export default Percentage;
