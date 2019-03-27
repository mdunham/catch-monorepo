import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import { Box, Autocomplete, Icon, fontColors } from '@catch/rio-ui-kit';

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 9,
    left: 6,
  },
  input: {
    paddingLeft: 40,
  },
});

function AutoSearch({ ...rest }) {
  return (
    <Box w={1}>
      <Autocomplete style={styles.input} {...rest} />
      <Icon
        name="search"
        fill={fontColors.primary}
        dynamicRules={{ paths: { fill: fontColors.primary } }}
        style={styles.icon}
      />
    </Box>
  );
}

export default AutoSearch;
