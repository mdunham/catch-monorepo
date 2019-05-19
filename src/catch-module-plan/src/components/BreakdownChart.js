import React from 'react';
import { array, number, object, string } from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { View } from 'react-native';

import { RadialChart } from '@catch/rio-ui-kit';

const EMPTY_COLOR = '#D7D9DE';

export const BreakdownChart = ({
  colors,
  data,
  intl: { formatNumber },
  total,
  legendText,
}) => {
  const colorsArray = data.map((key, i) => colors[i]);
  colorsArray[colorsArray.length - 1] = EMPTY_COLOR;
  return (
    <View>
      <RadialChart
        width={136}
        height={136}
        data={data}
        legendNumber={formatNumber(total, {
          style: 'percent',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}
        legendText={legendText}
        accessor={d => d.percent}
        colors={colorsArray}
      />
    </View>
  );
};

BreakdownChart.propTypes = {
  colors: array,
  data: array.isRequired,
  legendText: string,
  total: number.isRequired,
};

BreakdownChart.defaultProps = {
  colors: ['#FEB198', '#68AEAE', '#B5BC5E', '#EA8C9D'],
  legendText: 'TOTAL',
};

export default injectIntl(BreakdownChart);
