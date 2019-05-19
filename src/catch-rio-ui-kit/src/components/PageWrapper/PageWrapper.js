import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView, StyleSheet } from 'react-native';
import Box from '../Box';
import { padding, size } from '../../const';
import withDimensions from '../../tools/responsive';

export const PageWrapper = ({
  id,
  children,
  noPadding,
  viewport,
  horizontal,
  vertical,
  style,
  ...other
}) => (
  <SafeAreaView id={id} style={[styles.base, style]}>
    <Box
      w={1}
      screen={viewport}
      px={vertical || noPadding ? undefined : padding.x}
      py={horizontal || noPadding ? undefined : padding.y}
      {...other}
    >
      {children}
    </Box>
  </SafeAreaView>
);

PageWrapper.propTypes = {
  children: PropTypes.node,
  viewport: PropTypes.string,
  horizontal: PropTypes.bool,
  noPadding: PropTypes.bool,
};

PageWrapper.defaultProps = {
  viewport: 'PhoneOnly',
};

const styles = StyleSheet.create({
  base: {
    maxWidth: size.pageMaxWidth,
    width: '100%',
    marginHorizontal: 'auto',
  },
});

export default withDimensions(PageWrapper);
