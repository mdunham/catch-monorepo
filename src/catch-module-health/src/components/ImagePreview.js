import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform, Text, View } from 'react-native';

import { Modal, Icon, colors, styles as st } from '@catch/rio-ui-kit';

const Container = Platform.select({
  web: Modal,
  default: View,
});

const ImagePreview = ({ breakpoints, viewport, file, onClose }) => (
  <Container viewport={viewport} onRequestClose={onClose}>
    {breakpoints.current === 'PhoneOnly' &&
      Platform.select({
        web: (
          <View
            style={st.get([
              'RowContainer',
              'TopGutter',
              'LeftGutter',
              'BottomGutter',
            ])}
          >
            <Icon
              name="right"
              onClick={onClose}
              fill={colors.primary}
              stroke={colors.primary}
              dynamicRules={{ paths: { fill: colors.primary } }}
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </View>
        ),
      })}

    <Image source={{ uri: file }} style={{ width: '100%', height: 350 }} />
  </Container>
);

ImagePreview.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  file: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  viewport: PropTypes.string.isRequired,
};

export default ImagePreview;
