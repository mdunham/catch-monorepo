import React from 'react';
import PropTypes from 'prop-types';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ART,
} from 'react-native';

import { colors } from '../../const';
import ri from '../../svg/rio-illustrations.json';
import { dimensionsFromViewBox, groupShapes } from '../../tools/art/parsers';
import { createLogger } from '../../util/logger';

const Log = createLogger('figure');

const { Surface, Shape, Path: ArtPath, Transform, LinearGradient } = ART;

/**
 * Returns a single figure Object
 * @param {string} name - "name" property of icon
 * @param {Object} [iconsObj=icons] - JSON Array of Objects
 * @example
 * // Returns a single icon Object
 * this.findIcon('copy-code', icons.json);
 */
export function findFigure(name, figuresObj = ri) {
  const figure = figuresObj.filter(obj => obj.name === name);

  if (figure.length === 0) {
    return false;
  } else if (figure.length > 1) {
    throw new Error('Multiple icons found...');
  } else {
    return figure[0];
  }
}

/**
 * Returns "svgData" Object
 * @param {string} iconName - "name" property of icon
 * @example
 * // Returns svgData Object for given iconName
 * this.getSvgData('copy-code');
 */
export function getSvgData(figureName) {
  const figure = findFigure(figureName);
  return !!figure && figure.svgData;
}

export function isPrefixed(name) {
  return name.split('--')[0] === 'ri';
}

/**
 * @WARNING Very experimental. Do not use unless you know
 * what you're doing.
 * Eventually the Icon component should use the same technique...
 * (If proven to work great in native)
 * Converts raw svg data to react ART shapes
 * able to render to canvas, svg, and native graphics
 * (Only supports svg paths currently)
 */
const Figure = ({
  debug,
  fill,
  fillRule,
  stroke,
  strokeWidth,
  height,
  width,
  name,
  style,
  onClick,
  size,
  dynamicRules,
  ...other
}) => {
  const figure = isPrefixed(name)
    ? findFigure(name)
    : findFigure(`ri--${name}`);

  const { width: defaultWidth, height: defaultHeight } = dimensionsFromViewBox(
    figure,
  );

  const scale = typeof height === 'number' ? height / defaultHeight : 1;

  const svgContent = groupShapes(figure.svgData, scale, dynamicRules);

  return (
    <Surface width={width || defaultWidth} height={height || defaultHeight}>
      {svgContent}
    </Surface>
  );
};

Figure.propTypes = {
  fill: PropTypes.string,
  // Overides styles.
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

export default Figure;
