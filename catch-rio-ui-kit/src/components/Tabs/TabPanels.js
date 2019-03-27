import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

/**
 * TabPanels renders the correct panel based on what Tab is currently active
 */
const TabPanels = ({ children, activeIdx, ...other }) => (
  <View {...other}>{Children.toArray(children)[activeIdx]}</View>
);

TabPanels.propTypes = {
  children: PropTypes.node,
  activeIdx: PropTypes.number,
};

export default TabPanels;
