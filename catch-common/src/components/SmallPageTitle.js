import React from 'react';
import { Box, H3, Text } from '@catch/rio-ui-kit';

const SmallPageTitle = ({ children, title, subtitle, boxProps, textProps }) => (
  <Box mt={3} mb={2} {...boxProps}>
    <H3 {...textProps}>{children || title}</H3>
    {!!subtitle && (
      <Box mt={2}>
        <Text>{subtitle}</Text>
      </Box>
    )}
  </Box>
);

export default SmallPageTitle;
