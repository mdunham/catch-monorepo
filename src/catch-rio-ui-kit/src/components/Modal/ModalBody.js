import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import styles from '../../styles';

/**
 * ModalBody provides some sane default padding
 */
const ModalBody = ({ children, style, viewport, ...other }) => (
  <ScrollView
    contentContainerStyle={styles.get(
      ['Container', 'Margins', 'BottomSpace'],
      viewport,
    )}
  >
    {children}
  </ScrollView>
);

ModalBody.propTypes = {
  /** The content to be rendered */
  children: PropTypes.node,
};

export default ModalBody;
