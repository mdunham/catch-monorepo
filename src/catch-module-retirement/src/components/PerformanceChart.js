import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';

import {
  LineChart,
  Box,
  Text,
  colors,
  borderRadius,
  Divider,
  Fine,
} from '@catch/rio-ui-kit';

import ChartImage from './ChartImage';

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: colors['moss--light3'],
    borderRadius: borderRadius.regular,
  },
  text: {
    color: colors['moss--dark1'],
  },
  wrapper: {
    top: -20,
  },
});

const paths = {
  Aggressive:
    'M372 72.9987C216.5 118.5 113.5 119 0 121.996V119.498C286.539 111.498 312 39 372 0V72.9987Z',
  Moderate:
    'M372 48.9987C263.5 95.5 103.142 100.209 0 99.9958V97.4977C286.539 89.4979 351.5 28.5 372 0V48.9987Z',
  Conservative:
    'M372 72.9987C216.5 118.5 113.5 119 0 121.996V119.498C286.539 111.498 312 39 372 0V72.9987Z',
};

const data = {
  Aggressive: [
    { x: 0, y: 122 },
    { x: 5, y: 121 },
    { x: 35, y: 120 },
    { x: 165, y: 110 },
    { x: 250, y: 90 },
    { x: 370, y: 40 },
  ],
  Moderate: [
    { x: 0, y: 122 },
    { x: 5, y: 121 },
    { x: 35, y: 120 },
    { x: 165, y: 110 },
    { x: 250, y: 90 },
    { x: 370, y: 40 },
  ],
  Conservative: [
    { x: 0, y: 122 },
    { x: 5, y: 121 },
    { x: 35, y: 120 },
    { x: 160, y: 110 },
    { x: 250, y: 90 },
    { x: 370, y: 40 },
  ],
};

const percentages = {
  Aggressive: 14.86,
  Moderate: 10.32,
  Conservative: 4.56,
};

// @TODO: come back to this and use LineChart components. Ran out of time for demo.

const PerformanceChart = ({ portfolioName }) => (
  <React.Fragment>
    <Text mb={1}>Average return on investment:</Text>
    <Box w={90} style={styles.overlay} align="center">
      <Text weight="bold" p={1} style={styles.text}>
        + {`${percentages[portfolioName]}%`}
      </Text>
    </Box>

    <Box style={styles.wrapper}>
      <ChartImage portfolioName={portfolioName} />
      <Fine mt={1}>
        Investing in securities involves risks, and there is always the
        potential of losing money when you invest in securities. Past
        performance does not guarantee future results.
      </Fine>
    </Box>
  </React.Fragment>
);

export default PerformanceChart;
