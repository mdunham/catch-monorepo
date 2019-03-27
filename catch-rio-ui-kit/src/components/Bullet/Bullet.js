import React from 'react';

import Box from '../Box';
import Text from '../Text';

const Bullet = ({ children }) => (
  <Box mb={1} row>
    <Text color="ash" size={22} mr={1}>
      •
    </Text>
    <Text size="small" mt={7}>
      {children}
    </Text>
  </Box>
);

export default Bullet;
