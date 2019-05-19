import React from 'react';
import PropTypes from 'prop-types';

import { Box, Text, ProgressBar, colors } from '@catch/rio-ui-kit';

function formatName(name) {
  if (typeof name === 'string') {
    return `${name.charAt(0)}${name.toLowerCase().substring(1)}`;
  }
}

const Asset = ({ name, ticker, weight, width }) => (
  <Box mb={3}>
    <Box justify="space-between" row w={1}>
      <Text size="small">{formatName(name)}</Text>
      <Text size="small">{weight}%</Text>
    </Box>
    <Text spacing={1} size={11} color="link" my={1}>
      {ticker}
    </Text>
    <ProgressBar mode="chart" progress={weight / 100} />
  </Box>
);

Asset.propTypes = {
  name: PropTypes.string.isRequired,
  ticker: PropTypes.string.isRequired,
  weight: PropTypes.number.isRequired,
  width: PropTypes.number,
};

export default Asset;
