import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';

const breakpoints = {
  PhoneOnly: 599,
  TabletPortraitUp: 600,
  TabletLandscapeUp: 900,
  desktopUp: 1200,
};

const styles = StyleSheet.create({
  PhoneOnly: {},
  TabletLandscapeUp: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

/**
 * @NOTE: not sure if that's the best way yet
 */
const Container = Platform.select({
  web: View,
  default: ScrollView,
});

const ResponsiveContainer = ({ children, viewport, style, ...other }) => (
  <View style={[styles[viewport], style]} {...other}>
    {children}
  </View>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  viewport: PropTypes.string,
};

ResponsiveContainer.defaultProps = {
  viewport: 'PhoneOnly',
};

export default ResponsiveContainer;
