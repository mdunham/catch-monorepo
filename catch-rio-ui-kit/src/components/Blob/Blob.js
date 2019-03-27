import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Figure from '../Figure';
import Icon from '../Icon';

import { colors } from '../../const';

const Blob = ({ name, color, iconColor, blobColor, style }) => (
  <View style={style}>
    <Figure
      name="blob"
      dynamicRules={{
        paths: { fill: colors[`${color}--light3`] || blobColor },
      }}
    />
    {!!name && (
      <Icon
        name={name}
        dynamicRules={{
          paths: { fill: colors[`${color}--dark1`] || iconColor },
        }}
        fill={colors[`${color}--dark1`]}
        style={styles.icon}
        size={36}
      />
    )}
  </View>
);

Blob.propTypes = {
  name: PropTypes.string,
  color: PropTypes.string,
  iconColor: PropTypes.string,
  blobColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 36,
    left: 36,
  },
});

export default Blob;
