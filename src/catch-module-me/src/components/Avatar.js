import React from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, StyleSheet, View } from 'react-native';

/**
 * TODO: user should add an image by clicking on it
 *
 */
const Avatar = ({ onClick, style }) => (
  <TouchableOpacity onPress={onClick}>
    <View style={[styles.base, style]} />
  </TouchableOpacity>
);

Avatar.propTypes = {
  onClick: PropTypes.func,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 8,
    width: 32,
    height: 32,
    marginBottom: 16,
  },
});

export default Avatar;
