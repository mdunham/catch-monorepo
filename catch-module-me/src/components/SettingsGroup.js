import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { Box, H4, colors, borderRadius } from '@catch/rio-ui-kit';

const SettingsGroup = ({ children, title, titleProps }) => (
  <Box py={2} mb={3} style={styles.base}>
    {!!title && (
      <H4 mb={3} weight="bold" {...titleProps}>
        {title}
      </H4>
    )}
    {children}
  </Box>
);

SettingsGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  titleProps: PropTypes.object,
};

SettingsGroup.defaultProps = {
  titleProps: {},
};

const styles = StyleSheet.create({
  base: {
    maxWidth: 440,
  },
});

export default SettingsGroup;
