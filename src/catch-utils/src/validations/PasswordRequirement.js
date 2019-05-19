import React from 'react';
import PropTypes from 'prop-types';

import { Box, Text, Icon, colors } from '@catch/rio-ui-kit';

const PasswordRequirement = ({ description, isValid }) => (
  <Box row align="center" mb={1}>
    <Icon
      dynamicRules={{
        paths: { stroke: isValid ? colors.algae : colors['ink+2'] },
      }}
      stroke={isValid ? colors.algae : colors['ink+2']}
      name="valid-check"
    />
    <Text
      ml={1}
      weight="medium"
      size="small"
      color={isValid ? colors.charcoal : colors.smoke}
    >
      {description}
    </Text>
  </Box>
);

PasswordRequirement.propTypes = {
  description: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
};

export default PasswordRequirement;
