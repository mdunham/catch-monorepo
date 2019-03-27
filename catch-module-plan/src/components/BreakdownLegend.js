import React from 'react';
import { array, object } from 'prop-types';

import { Box, Text, LegendRow } from '@catch/rio-ui-kit';

const BreakdownLegend = ({ activeKeys, colors, data, titles }) => {
  return (
    <Box>
      {activeKeys.map((key, i) => (
        <Box mt={1} key={i}>
          <LegendRow
            backgroundColor={colors[i]}
            label={titles[key]}
            percentage={data[key].paycheckPercentage}
          />
        </Box>
      ))}
    </Box>
  );
};

BreakdownLegend.propTypes = {
  activeKeys: array.isRequired,
  colors: array,
  data: object.isRequired,
  titles: object.isRequired,
};

BreakdownLegend.defaultProps = {
  colors: ['#FFA09D', '#DDA7FE', '#98EDD4'],
};

export default BreakdownLegend;
