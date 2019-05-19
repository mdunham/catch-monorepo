/* @flow */
import * as React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { size, withDimensions } from '@catch/rio-ui-kit';

const Main = ({ id, children, style, viewport }) => (
  <View
    id={id}
    style={[styles.base, styles[viewport], style]}
    accessibilityRole="main"
  >
    {children}
  </View>
);

Main.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  base: {
    height: '100%',
    paddingTop: size.navbarHeight,
  },
  PhoneOnly: {
    paddingTop: 54,
  },
  TabletPortraitUp: {
    paddingTop: 54,
  }
});
export default withDimensions(Main);
