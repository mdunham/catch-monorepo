import React from 'react';
import PropTypes from 'prop-types';
import { Image, Platform } from 'react-native';

import AggressiveChart from '../assets/Aggressive.png';
import ConservativeChart from '../assets/Conservative.png';
import ModerateChart from '../assets/Moderate.png';

const images = {
  Aggressive: AggressiveChart,
  Moderate: ModerateChart,
  Conservative: ConservativeChart,
};

const heights = {
  Aggressive: {
    height: 122,
  },
  Moderate: {
    height: 100,
  },
  Conservative: {
    height: 71,
  },
};

const ChartImage = ({ width, portfolioName }) => (
  <Image
    alt={`${portfolioName} chart`}
    style={{ width, height: heights[portfolioName].height }}
    source={Platform.select({
      web: { uri: images[portfolioName] },
      default: images[portfolioName],
    })}
  />
);

ChartImage.propTypes = {
  width: PropTypes.number,
  portfolioName: PropTypes.string.isRequired,
};

ChartImage.defaultProps = {
  width: 370,
};

export default ChartImage;
