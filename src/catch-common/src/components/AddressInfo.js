import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';

import Label from './Label';

const PREFIX = 'catch.plans.AddressInfo';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

const AddressInfo = ({ legalAddress }) => (
  <Fragment>
    <Label>{COPY['label']}</Label>
    <Text weight="medium">{legalAddress.street1}</Text>
    {legalAddress.street2 && (
      <Text weight="medium">{legalAddress.street2}</Text>
    )}
    <Text weight="medium">{`${legalAddress.city}, ${legalAddress.state}`}</Text>
    <Text weight="medium">{legalAddress.zip}</Text>
  </Fragment>
);

AddressInfo.propTypes = {
  legalAddress: PropTypes.shape({
    street1: PropTypes.string.isRequired,
    street2: PropTypes.string,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    zip: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddressInfo;
