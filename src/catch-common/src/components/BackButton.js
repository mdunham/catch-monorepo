import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { Box, Icon, colors, Button, Text } from '@catch/rio-ui-kit';

const BackButton = ({ title, onClick }) => (
  <TouchableOpacity
    onPress={onClick}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
    }}
  >
    <Box row p={3}>
      <Icon
        name="right"
        fill={colors.ink}
        stroke={colors.ink}
        dynamicRules={{ paths: { fill: colors.ink } }}
        style={{ transform: [{ rotate: '180deg' }] }}
      />
      <Text ml={1} color="ink" weight="bold">
        {title}
      </Text>
    </Box>
  </TouchableOpacity>
);

export default BackButton;
