import React, { Component } from 'react';
import { Platform } from 'react-native';
import {
  Box,
  Paper,
  colors,
  borderRadius,
  shadow,
  animations,
} from '@catch/rio-ui-kit';

const SmallContainer = ({ children, style, viewport, ...other }) => (
  <Box align="center">
    <Paper
      mt="5%"
      style={{
        ...animations.fadeInUp,
        maxWidth: 415,
        minHeight: 414,
        width: '100%',
        ...(style || {}),
      }}
      flat={viewport === 'PhoneOnly'}
      {...other}
    >
      <Box p={viewport === 'PhoneOnly' ? 24 : 32} align="stretch">
        {children}
      </Box>
    </Paper>
  </Box>
);

export default SmallContainer;
