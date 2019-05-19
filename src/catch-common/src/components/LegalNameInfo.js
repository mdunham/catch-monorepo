import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.plans.LegalNameInfo';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

const LegalNameInfo = ({ legalName }) => (
  <Fragment>
    <Label>{COPY['label']}</Label>
    <Text weight="medium">{legalName}</Text>
  </Fragment>
);

LegalNameInfo.propTypes = {
  legalName: PropTypes.string.isRequired,
};

export default LegalNameInfo;
