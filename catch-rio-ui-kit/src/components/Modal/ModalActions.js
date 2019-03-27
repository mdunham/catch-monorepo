import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from '../../styles';

/**
 * ModalActions provides some sane default padding
 */
const ModalActions = ({ children, space, caption, ...other }) => {
  const actions = Children.toArray(children);
  return (
    <View style={styles.get(['ContainerRow'])}>
      {caption && <Text style={styles.get(['FinePrint'])}>{caption}</Text>}
      {actions.length > 1 ? (
        <View style={styles.get(['CenterRightRow'])}>
          <View style={styles.get(['RightGutter'])}>{actions[0]}</View>
          <View>{actions[1]}</View>
        </View>
      ) : (
        children
      )}
    </View>
  );
};

ModalActions.propTypes = {
  /** The content to be rendered */
  children: PropTypes.node,
  /** Optional caption to explain the actions a bit more  */
  caption: PropTypes.string,
};

export default ModalActions;
