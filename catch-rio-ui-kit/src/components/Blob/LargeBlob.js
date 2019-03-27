import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Figure from '../Figure';
import Icon from '../Icon';

function selectFigure(viewport) {
  switch (viewport) {
    case 'PhoneOnly':
      return 'giant-ovals';
    default:
      return 'blobs';
  }
}

const LargeBlob = ({ name, style, viewport }) => (
  <View style={style}>
    <Figure name={selectFigure(viewport)} />
    <Icon
      name={name}
      size={88}
      style={[
        styles.icon,
        styles[`icon${viewport}`],
        name === 'guide' &&
          viewport === 'PhoneOnly' &&
          styles.guideSpecialPosition,
      ]}
    />
  </View>
);

Blob.propTypes = {
  name: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  iconColor: PropTypes.string,
  blobColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
};

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    top: 73,
    left: 78,
  },
  iconPhoneOnly: {
    top: 63,
    left: 156,
  },
  guideSpecialPosition: {
    left: 144,
  },
});

export default LargeBlob;
