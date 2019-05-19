import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { Box, Text } from '@catch/rio-ui-kit';

const ActionableInfo = ({ onPress, label, value, qaName, ...other }) => (
  <Box {...other} style={{ alignSelf: 'flex-start' }}>
    <Box mb={1}>
      <Text size="small" weight="medium">
        {label}
      </Text>
    </Box>
    <TouchableOpacity onPress={onPress}>
      <Text
        color={onPress ? 'link' : 'ink'}
        weight={onPress ? 'medium' : 'normal'}
        qaName={qaName}
      >
        {value}
      </Text>
    </TouchableOpacity>
  </Box>
);

ActionableInfo.propTypes = {
  onPress: PropTypes.func.isRequired,
  label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.number,
  ]).isRequired,
};

export default ActionableInfo;
