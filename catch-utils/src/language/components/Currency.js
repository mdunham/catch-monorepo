import React from 'react';
import PropTypes from 'prop-types';
import { FormattedNumber } from 'react-intl';

const Currency = ({ children, whole }) => (
  <FormattedNumber
    style="currency"
    value={children}
    currency="USD"
    minimumFractionDigits={whole ? 0 : 2}
    maximumFractionDigits={whole ? 0 : 2}
  />
);

export default Currency;
