import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';
import format from 'date-fns/format';

const ShortDate = ({ children }) => {
  return <FormattedDate value={format(children)} month="short" day="2-digit" />;
};

ShortDate.propTypes = {
  children: PropTypes.node,
};

export default ShortDate;
