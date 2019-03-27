import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Paper, Box, Text, Spinner, Icon, colors } from '@catch/rio-ui-kit';

const ConfirmationLoading = ({ goalName, status, COPY }) => (
  <Paper deep w={450}>
    <Box mt={125} align="center">
      {status === 'success' ? (
        <Icon
          name="check"
          fill={colors.primary}
          stroke={colors.primary}
          size={28}
        />
      ) : (
        <Spinner large />
      )}
    </Box>
    <Box mt={4} mb={125}>
      <Text size="large" weight="medium" center>
        {COPY[status]}
      </Text>
    </Box>
  </Paper>
);

export default ConfirmationLoading;
