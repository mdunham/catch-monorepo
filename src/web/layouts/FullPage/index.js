import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { size } from '@catch/rio-ui-kit';

/**
 * FullPage ensures it's children are in a 100% width/height container
 */
const FullPage = ({ id, children }) => (
  <View style={styles.base} id={id}>
    {children}
  </View>
);

FullPage.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
};

const styles = StyleSheet.create({
  base: {
    // paddingTop: size.navbarHeight,
    flex: 1,
  },
});

export default FullPage;
