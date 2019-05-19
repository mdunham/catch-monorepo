import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform } from 'react-native';

import Img from '../assets/FolioClient.png';

const FolioClient = ({ width, height, ...rest }) => (
  <Image
    alt="Folio Client"
    style={{ width, height }}
    source={Platform.select({
      web: { uri: Img },
      default: Img,
    })}
    {...rest}
  />
);

FolioClient.defaultProps = {
  width: 127,
  height: 32,
};

export default FolioClient;
