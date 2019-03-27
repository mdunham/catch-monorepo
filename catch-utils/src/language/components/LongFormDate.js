import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import format from 'date-fns/format';

const LongFormDate = ({ children }) => {
  return (
    <FormattedDate
      value={format(children)}
      year="numeric"
      month="long"
      day="2-digit"
    />
  );
};

LongFormDate.propTypes = {
  children: PropTypes.node,
};

export default LongFormDate;
