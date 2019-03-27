import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform } from 'react-native';
import { styles } from '@catch/rio-ui-kit';
import Img from '../assets/empty-statement-icon.png';

const EmptyStatement = ({ width, height }) => (
  <Image
    alt="Statements"
    style={[{ width, height }, styles.get('TopGutter')]}
    source={Platform.select({
      web: { uri: Img },
      default: Img,
    })}
  />
);

EmptyStatement.defaultProps = {
  width: 85,
  height: 85,
};

export default EmptyStatement;
