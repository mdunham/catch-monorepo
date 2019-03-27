import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import format from 'date-fns/format';

const NumericDate = ({ children }) => (
  <FormattedDate
    value={format(children)}
    year="numeric"
    day="2-digit"
    month="2-digit"
  />
);

NumericDate.propTypes = {
  children: PropTypes.string,
};

export default NumericDate;
