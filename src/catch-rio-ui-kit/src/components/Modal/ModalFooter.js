import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import styles from '../../styles';
/**
 * ModalFooter provides some sane default padding
 */
const ModalFooter = ({ children, divider, ...other }) => (
  <View style={styles.get(['BottomBar', 'SmMargins'])}>{children}</View>
);

ModalFooter.propTypes = {
  /** The content to be rendered */
  children: PropTypes.node,
};

export default ModalFooter;
