import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import styles from '../../styles';
/**
 * ModalHeader provides some sane default padding
 */
const ModalHeader = ({ children, viewport, ...other }) => (
  <View
    style={styles.get(
      ['FluidAlign', 'Margins', 'TopSpace', 'BottomGutter'],
      viewport,
    )}
  >
    {children}
  </View>
);

ModalHeader.propTypes = {
  children: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
export default ModalHeader;
