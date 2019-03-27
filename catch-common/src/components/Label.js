import React from 'react';
import { func, oneOfType, string, object } from 'prop-types';

import { Text, Box } from '@catch/rio-ui-kit';

const Label = ({ children }) => {
  return (
    <Box mb={1}>
      <Text color="subtle" size="small" weight="medium">
        {children}
      </Text>
    </Box>
  );
};

Label.propTypes = { children: oneOfType([func, string, object]).isRequired };

export default Label;
