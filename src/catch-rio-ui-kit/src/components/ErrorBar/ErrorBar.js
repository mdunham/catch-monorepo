import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import Box from '../Box';
import Text from '../Text';
import { colors } from '../../const';

/**
 * ErrorBar shows something went wrong while loading
 * progress.
 */
const ErrorBar = ({ message }) => (
  <Box>
    <View style={styles.track} />
    <View style={styles.crossContainer}>
      <View style={styles.cross} />
    </View>
    <Box w={1} align="center" mt={2}>
      <Text color="error" center>
        {message}
      </Text>
    </Box>
  </Box>
);

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: 3,
    backgroundColor: colors.gray4,
  },
  cross: {
    backgroundColor: colors.gray4,
    height: '100%',
    width: '100%',
    borderRadius: 3,
  },
  crossContainer: {
    width: 26,
    height: 8,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: '#fff',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ rotate: '-45deg' }],
  },
});

export default ErrorBar;
