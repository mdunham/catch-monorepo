import React from 'react';
import { Image, Platform } from 'react-native';

import image from '../assets/home-empty.png';

const HomeEmptyIllustration = ({ size }) => (
  <Image
    alt="All caught up"
    style={{ width: size, height: size, marginLeft: -100 }}
    source={Platform.select({
      web: { uri: image },
      default: image,
    })}
  />
);

HomeEmptyIllustration.defaultProps = {
  size: 425,
};

export default HomeEmptyIllustration;
