import React from 'react';
import { Image, Platform } from 'react-native';
import { Box, Text, Figure } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

const BetaHeader = ({ viewport }) => (
  <Box mt={viewport === 'PhoneOnly' ? 48 : 1} mb={40} align="center">
    <Figure
      name="catch-black"
      {...Platform.select({
        web: { width: 100, height: 27 },
        default: { width: 117, height: 32 },
      })}
    />
    <Text mt={10} center size="large" color="ink+1">
      {Env.envName || 'Beta'}
    </Text>
  </Box>
);
export default BetaHeader;
