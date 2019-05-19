import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.plans.DobInfo';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

const DobInfo = ({ dob }) => (
  <Fragment>
    <Label>{COPY['label']}</Label>
    <Text weight="medium">{format(dob, 'MM/DD/YYYY')}</Text>
  </Fragment>
);

DobInfo.propTypes = {
  dob: PropTypes.string.isRequired,
};

export default DobInfo;
