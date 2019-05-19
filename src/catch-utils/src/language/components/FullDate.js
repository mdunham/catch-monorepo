import React from 'react';
import PropTypes from 'prop-types';
import isToday from 'date-fns/is_today';
import isYesterday from 'date-fns/is_yesterday';
import isDate from 'date-fns/is_date';

import NumericDate from './NumericDate';

// Small util function to determine if we should use 'on'
// before the date in a sentence
export const preDateWord = date => !isToday(date) && !isYesterday(date);

// Our generalized date component to use consistent
// date formatting throughout the app
const FullDate = ({ children, capitalize, uppercase }) => {
  if (!isDate(new Date(children))) return children;

  return isToday(children) ? (
    capitalize ? (
      'Today'
    ) : uppercase ? (
      'TODAY'
    ) : (
      'today'
    ) //TODO: intl
  ) : isYesterday(children) ? (
    capitalize ? (
      'Yesterday'
    ) : uppercase ? (
      'YESTERDAY'
    ) : (
      'yesterday'
    )
  ) : (
    <NumericDate>{children}</NumericDate>
  );
};

FullDate.propTypes = {
  children: PropTypes.string,
  capitalize: PropTypes.bool,
};

export default FullDate;
