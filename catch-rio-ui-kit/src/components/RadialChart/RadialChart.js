import React from 'react';
import PropTypes from 'prop-types';
import { ART, Platform } from 'react-native';
import * as d3 from 'd3-shape';

import { createLogger } from '../../util/logger';
import { selectFontStyles } from '../Text';

const Log = createLogger('radial-chart');

const { Surface, Group, Shape, Text } = ART;

const MARGIN = 10;

// Our d3 methods could be extracted as general purpose
// utility functions
export const createSections = accessor => data =>
  d3
    .pie()
    .sort(null)
    .value(accessor)(data);

export const createPath = size =>
  d3
    .arc()
    .outerRadius(size / 2)
    .padAngle(0.03)
    .innerRadius(63);

class RadialChart extends React.PureComponent {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.array.isRequired,
    // We tell how we want our values to be found in the data
    accessor: PropTypes.func.isRequired,
    // We pass an array of colors
    colors: PropTypes.array.isRequired,
    // We pass a text legend
    legendText: PropTypes.string,
    // We pass a number legend but it's still a string
    legendNumber: PropTypes.string,

    legendNumberFontWeight: PropTypes.string,
  };

  static defaultProps = {
    legendNumberFontWeight: 'bold',
  };

  constructor(props) {
    super(props);
    this.createSections = createSections(props.accessor);
    this.createPath = createPath(props.width);
  }

  render() {
    const {
      width,
      height,
      data,
      accessor,
      colors,
      legendText,
      legendNumber,
      legendNumberFontWeight,
    } = this.props;

    const sectionAngles = this.createSections(data);

    return (
      <Surface width={width + MARGIN} height={height + MARGIN}>
        <Group x={(width + MARGIN) / 2} y={(height + MARGIN) / 2}>
          {sectionAngles.map((section, i) => (
            <Shape
              key={i}
              d={this.createPath(section)}
              stroke={colors[i]}
              fill={colors[i]}
              strokeWidth={1}
              // strokeCap="square"
              // strokeJoin="miter"
            />
          ))}
        </Group>
        <Group x={(width + MARGIN) / 2} y={(height + MARGIN) / 2}>
          <Text
            y={(height + MARGIN) / 2 - 94}
            alignment={Platform.select({ web: 'middle', default: 'center' })}
            fill="#1F2533"
            font={{
              fontSize: 26,
              ...selectFontStyles({ weight: legendNumberFontWeight }),
            }}
          >
            {legendNumber}
          </Text>
          <Text
            y={(height + MARGIN) / 2 - 64}
            alignment={Platform.select({ web: 'middle', default: 'center' })}
            fill="#1F2533"
            font={{
              fontSize: 11,
              ...selectFontStyles({ weight: 'medium' }),
            }}
          >
            {legendText}
          </Text>
        </Group>
      </Surface>
    );
  }
}

export default RadialChart;
