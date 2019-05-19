import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Image, Platform } from 'react-native';

// import Svg from '../assets/FailCone.svg';
/* Load a png in native for now we can optimize for rendering
 * if we have time one day... */
import Img from '../assets/FailCone.png';

const FailCone = ({ width, height }) => (
  <Image
    alt="it's not you, it's us"
    style={{ width, height }}
    source={Platform.select({
      web: { uri: Img },
      default: Img,
    })}
  />
);

FailCone.defaultProps = {
  width: 350,
  height: 275,
};

export default FailCone;
