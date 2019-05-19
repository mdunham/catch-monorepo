import React from 'react';
import PropTypes from 'prop-types';
import { ART, Platform } from 'react-native';
import * as d3 from 'd3-shape';

import Box from '../Box';
import Text from '../Text';
import { colors } from '../../const';

const { Group, Shape, Path, Surface, LinearGradient } = ART;

let gColors = ['#EBF0FF', '#DBE5FF', '#EBF0FF'];
let linearGradient = new LinearGradient(gColors, 0, 20, 0, 280);

class LineChart extends React.PureComponent {
  static defaultProps = {
    x: 0,
    y: 0,
  };
  render() {
    const { width, height, x, y, linePath, data } = this.props;

    const line = d3
      .line()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3.curveMonotoneX);

    return (
      <React.Fragment>
        <Surface width={width} height={height}>
          <Group x={x} y={y}>
            <Shape
              strokeWidth={2}
              d={linePath}
              stroke="#fff"
              fill={linearGradient}
            />
            <Shape
              strokeWidth={2}
              d={line(data)}
              stroke={colors['wave--light1']}
            />
          </Group>
        </Surface>
      </React.Fragment>
    );
  }
}

export default LineChart;
