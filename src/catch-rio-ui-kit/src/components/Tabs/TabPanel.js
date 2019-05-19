import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

/**
 * TabPanel is only used to render the correct content based on what tab is
 * currently active.
 */
const TabPanel = ({ children, style, ...other }) => (
  <View style={style} {...other}>
    {children}
  </View>
);

TabPanel.propTypes = {
  children: PropTypes.node,
};

export default TabPanel;
