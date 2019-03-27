import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import Box from '../Box';
import { colors, shadow, borderRadius } from '../../const';

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors['ink+3'],
    ...shadow.card,
    borderRadius: borderRadius.regular,
  },
  flat: {
    shadowOpacity: 0,
    elevation: 0,
    borderColor: colors.white,
  },
  raised: {
    ...shadow.deep,
  },
  white: {
    backgroundColor: colors.white,
  },
  opaque: {
    opacity: 0.5,
  },
});

/**
 * Paper is the box shadow we use for card components
 */
class Paper extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    flat: PropTypes.bool,
    raised: PropTypes.bool,
    white: PropTypes.bool,
    opaque: PropTypes.bool,
    style: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  };
  render() {
    const {
      children,
      flat,
      raised,
      fadeIn,
      style,
      white,
      opaque,
      ...other
    } = this.props;
    const elementStyle = StyleSheet.flatten(style);
    return (
      <Box
        style={[
          styles.base,
          flat && styles.flat,
          raised && styles.raised,
          white && styles.white,
          opaque && styles.opaque,
          elementStyle,
        ]}
        {...other}
      >
        {children}
      </Box>
    );
  }
}

export default Paper;
