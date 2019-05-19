import React from 'react';
import PropTypes from 'prop-types';

import { Text, Box } from '@catch/rio-ui-kit';

const EmailModalHeader = ({ title, caption }) => (
  <Box py={2}>
    <Box>
      <Text size="large" weight="medium">
        {title}
      </Text>
    </Box>
    <Box mt={2}>
      <Text color="gray3">{caption}</Text>
    </Box>
  </Box>
);

EmailModalHeader.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  caption: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default EmailModalHeader;
