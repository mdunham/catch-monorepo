import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text, Spinner, size, colors } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.login.LoadingIndicator';
export const COPY = {
  'user-create': <FormattedMessage id={`${PREFIX}.user-create`} />,
  'user-confirm': <FormattedMessage id={`${PREFIX}.user-confirm`} />,
  'user-info': <FormattedMessage id={`${PREFIX}.user-info`} />,
};

const LoadingIndicator = ({ step, ...other }) => (
  <Box
    style={{ height: '100%', backgroundColor: colors.white }}
    pt={step === 'user-info' ? size.navbarHeight : 0}
    {...other}
  >
    <Box align="center" mt={125}>
      <Spinner large />
    </Box>
    {Boolean(step && COPY[step]) && (
      <Box mt={4} mb={125}>
        <Text size="large" weight="medium" center>
          {COPY[step]}
        </Text>
      </Box>
    )}
  </Box>
);

LoadingIndicator.propTypes = {
  step: PropTypes.string,
};

export default LoadingIndicator;
