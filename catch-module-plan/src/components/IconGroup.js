import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import {
  Box,
  Icon,
  Text,
  colors,
  space,
  withDimensions,
} from '@catch/rio-ui-kit';

const styles = StyleSheet.create({
  clipboard: {
    height: 40.18,
    width: 31,
    marginBottom: space[2],
  },
  comments: {
    height: 35.34,
    width: 40,
    marginBottom: space[2],
  },
  map: {
    height: 36.83,
    width: 34,
    marginBottom: space[2],
  },
  dottedLine: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: colors.primary,
    width: 16,
    marginBottom: 26,
    opacity: 0.4,
  },
});

export const IconGroup = ({ copy, viewport }) => (
  <Box
    row={viewport === 'TabletLandscapeUp'}
    my={5}
    align="center"
    justify="center"
  >
    <Box mx={1} align="center" mb={1}>
      <Icon name="comments" stroke="none" fill="none" style={styles.comments} />
      <Text size="small">{copy.comments}</Text>
    </Box>
    <View style={styles.dottedLine} />
    <Box mx={1} align="center" mb={1}>
      <Icon
        name="clipboard"
        stroke="none"
        fill="none"
        style={styles.clipboard}
      />
      <Text size="small">{copy.clipboard}</Text>
    </Box>
    <View style={styles.dottedLine} />
    <Box mx={1} align="center" mb={1}>
      <Icon name="map" stroke="none" fill={colors.primary} style={styles.map} />
      <Text size="small">{copy.map}</Text>
    </Box>
  </Box>
);

IconGroup.propTypes = {
  copy: PropTypes.object.isRequired,
};

export default withDimensions(IconGroup);
