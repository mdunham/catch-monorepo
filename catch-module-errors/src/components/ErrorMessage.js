import React from 'react';
import { Box, Text, Icon } from '@catch/rio-ui-kit';

/**
 * Temporary placeholder when something bad happens...
 */
const ErrorMessage = () => (
  <Box p={3} align="center">
    <Box mb={1} align="center">
      <Icon name="warning" size={39} />
    </Box>
    <Text>Something went wrong</Text>
  </Box>
);

export default ErrorMessage;
