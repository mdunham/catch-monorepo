import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '../../const';
import icons from '../../svg/rio-icons.json';
import { createLogger } from '../../util/logger';

const Log = createLogger('svg-icon');

/**
 * Returns a single icon Object
 * @param {string} name - "name" property of icon
 * @param {Object} [iconsObj=icons] - JSON Array of Objects
 * @example
 * // Returns a single icon Object
 * this.findIcon('copy-code', icons.json);
 */
export function findIcon(name, iconsObj = icons) {
  const icon = iconsObj.filter(obj => obj.name === name);

  if (icon.length === 0) {
    return false;
  } else if (icon.length > 1) {
    throw new Error('Multiple icons found...');
  } else {
    return icon[0];
  }
}

/**
 * Returns "svgData" Object
 * @param {string} iconName - "name" property of icon
 * @example
 * // Returns svgData Object for given iconName
 * this.getSvgData('copy-code');
 */
export function getSvgData(iconName) {
  const icon = findIcon(iconName);
  return icon ? icon.svgData : false;
}

/**
 * Returns a string with svg element properties
 * @param {Object} svgElement
 * @param {String} elementName
 */
export function svgElementsToString(
  svgElement,
  elementName,
  overrideProps = {},
) {
  const el = {
    ...svgElement,
    ...overrideProps,
  };
  let propString = Object.keys(el)
    .map(elementProp => `${elementProp}="${el[elementProp]}"`)
    .concat(`></${elementName}>`)
    .reduce((a, b) => `${a} ${b}`, `<${elementName}`);

  return propString;
}

/**
 * Returns the SVG elements in a string
 * @param {Object} svgData - JSON Object for an SVG icon
 * @example
 * // Returns SVG elements
 * const svgData = getSvgData('copy-code');
 * svgShapes(svgData);
 */
export function svgShapesToString(svgData, dynamicRules) {
  const svgElements = Object.keys(svgData)
    .filter(key => svgData[key])
    .map(svgProp => {
      const data = svgData[svgProp];
      const overrideProps =
        typeof dynamicRules === 'object' && dynamicRules[svgProp]
          ? dynamicRules[svgProp]
          : {};
      return data.map((el, index) =>
        svgElementsToString(
          el,
          svgProp.substr(0, svgProp.length - 1),
          overrideProps[index],
        ),
      );
    });
  let string = '';
  for (let i = 0; i < svgElements.length; i++) {
    string += svgElements[i];
  }

  return string;
}

export function isPrefixed(name) {
  return name.split('--')[0] === 'icon';
}

/**
 * Returns a react native image with an svg string as source in web
 * and a png in native.
 * @NOTE: You can now provide a map of svg rules to provide for each svg element
 */
const Icon = ({
  debug,
  fill,
  fillRule,
  stroke,
  strokeWidth,
  height,
  name,
  style,
  width,
  onClick,
  size,
  dynamicRules,
  ...other
}) => {
  const icon = isPrefixed(name) ? findIcon(name) : findIcon(`icon--${name}`);
  // In case we need to enforce static styles we just inject them
  const extraContent = !!icon && !!icon.injectStatic ? icon.injectStatic : '';
  const svgContent = !!icon
    ? svgShapesToString(icon.svgData, dynamicRules) + extraContent
    : '';
  const dataSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="${
    icon.viewBox
  }" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}">${svgContent}</svg>`;

  const element = (
    <Image
      source={Platform.select({ web: { uri: dataSvg }, default: icon.pngData })}
      style={[
        styles.base,
        !!size && { height: size, width: size },
        !!height && { height, width },
        // Enables coloring of png icons
        Platform.OS !== 'web' && !!fill && { tintColor: colors[fill] || fill },
        Platform.OS !== 'web' &&
          !!stroke && { tintColor: colors[stroke] || stroke },
        style,
        debug && styles.debug,
      ]}
    />
  );
  if (typeof onClick === 'function') {
    return (
      <TouchableOpacity onPress={onClick} {...other}>
        {element}
      </TouchableOpacity>
    );
  }
  return element;
};

const styles = StyleSheet.create({
  base: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  debug: {
    backgroundColor: colors.primary,
  },
});

Icon.propTypes = {
  fill: PropTypes.string,
  // Overides styles.
  style: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
  // Overides svg element properties dynamically
  dynamicRules: PropTypes.object,
};

export default Icon;
