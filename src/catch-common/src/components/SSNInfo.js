import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.plans.SSNInfo';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

const SSNInfo = ({ ssn }) => (
  <Fragment>
    <Label>{COPY['label']}</Label>
    <Text weight="medium">
      <Text size={22}>•••</Text> <Text size={18}> - </Text>{' '}
      <Text size={22}>••</Text> <Text size={18}> - </Text> <Text>{ssn}</Text>
    </Text>
  </Fragment>
);

SSNInfo.propTypes = {
  ssn: PropTypes.string.isRequired,
};

export default SSNInfo;
