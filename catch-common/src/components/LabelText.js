import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

const LabelText = ({ fieldName, lowercase }) => (
  <FormattedMessage
    id={`catch.user.${fieldName}.label${lowercase ? '.lowercase' : ''}`}
  />
);

LabelText.propTypes = {
  fieldName: PropTypes.string.isRequired,
  lowercase: PropTypes.bool,
};

export default LabelText;
