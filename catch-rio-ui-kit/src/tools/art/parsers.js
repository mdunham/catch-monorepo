import React from 'react';
import { ART } from 'react-native';
import { createLogger } from '../../util/logger';

const Log = createLogger('art-parser');
const { Surface, Shape, Path: ArtPath, Transform, LinearGradient } = ART;

export function dimensionsFromViewBox(figureObj = {}) {
  const viewBox = figureObj.viewBox;
  if (typeof viewBox !== 'string') {
    return {
      width: 0,
      height: 0,
    };
  }
  const dimensions = viewBox.split(' ');
  return {
    width: dimensions[2],
    height: dimensions[3],
  };
}

/**
 * Merges static props from the json data and props added at runtime
 * @param {Object} elProps json data props
 * @param {Object|Array} dynProps pass an array to assign specific rules
 * @param {number} elIdx
 */
export function createProps(elProps = {}, dynProps = {}, elIdx) {
  const addOns = Array.isArray(dynProps)
    ? dynProps[elIdx]
    : dynProps
      ? dynProps
      : {};
  return {
    ...elProps,
    ...addOns,
  };
}

/**
 * Returns the SVG elements in a string
 * @param {Object} svgData - a map of different shape arrays
 * @returns {Array} - Art components
 */
export function groupShapes(svgData, scale, rules = {}) {
  let svgElements = [];
  Object.keys(svgData).forEach(key => {
    if (svgData[key]) {
      switch (key) {
        case 'ellipses':
        case 'circles':
          svgElements = svgElements.concat(
            svgData[key].map((el, i) => {
              const props = createProps(el, rules[key], i);
              return (
                <Circle
                  {...props}
                  scale={scale}
                  key={`circle-${i + svgElements.length}`}
                />
              );
            }),
          );
          break;
        case 'rects':
          svgElements = svgElements.concat(
            svgData[key].map((el, i) => {
              const props = createProps(el, rules[key], i);
              return (
                <Rectangle
                  {...props}
                  scale={scale}
                  key={`rect-${i + svgElements.length}`}
                />
              );
            }),
          );
          break;
        case 'paths':
        default:
          svgElements = svgElements.concat(
            svgData[key].map((el, i) => {
              const props = createProps(el, rules[key], i);
              return (
                <Path
                  {...props}
                  scale={scale}
                  key={`path-${i + svgElements.length}`}
                />
              );
            }),
          );
      }
    }
  });
  return svgElements;
}

/**
 * Creates an elliptical path based on circle props
 */
export function Circle(props) {
  const radius = props.r || props.rx;
  const lg = props.linearGradient;
  let fill = props.fill;
  let stroke = props.stroke;
  let strokeWidth = props['stroke-width'];
  // if (lg) {
  //   fill = new LinearGradient(lg.stops, lg.x1, lg.y1, lg.x2, lg.y2);
  // }

  const path = ArtPath()
    .moveTo(0, -radius)
    .arc(0, radius * 2, radius)
    .arc(0, radius * -2, radius)
    .close();
  return (
    <Shape
      rotation={props.rotation}
      fill={fill === 'none' ? undefined : fill}
      stroke={stroke === 'none' ? undefined : stroke}
      strokeWidth={strokeWidth}
      d={path}
      opacity={props['opacity']}
      y={Number(props.cy)}
      x={Number(props.cx)}
      scale={props.scale}
      scaleX={
        props.scale && props.scale !== 1 ? undefined : Number(props.scaleX || 1)
      }
      scaleY={
        props.scale && props.scale !== 1 ? undefined : Number(props.scaleY || 1)
      }
    />
  );
}

/**
 * Creates a rectangular path based on rect props
 */
export function Rectangle(props) {
  let width = props.width;
  let height = props.height;
  let radius = props.radius || Number(props.rx) || 0;

  // if unspecified, radius(Top|Bottom)(Left|Right) defaults to the radius
  // property
  let tl = props.radiusTopLeft ? props.radiusTopLeft : radius;
  let tr = props.radiusTopRight ? props.radiusTopRight : radius;
  let br = props.radiusBottomRight ? props.radiusBottomRight : radius;
  let bl = props.radiusBottomLeft ? props.radiusBottomLeft : radius;

  const path = ArtPath();

  // for negative width/height, offset the rectangle in the negative x/y
  // direction. for negative radius, just default to 0.
  if (width < 0) {
    path.move(width, 0);
    width = -width;
  }
  if (height < 0) {
    path.move(0, height);
    height = -height;
  }
  if (tl < 0) {
    tl = 0;
  }
  if (tr < 0) {
    tr = 0;
  }
  if (br < 0) {
    br = 0;
  }
  if (bl < 0) {
    bl = 0;
  }

  // disable border radius if it doesn't fit within the specified
  // width/height
  if (tl + tr > width) {
    tl = 0;
    tr = 0;
  }
  if (bl + br > width) {
    bl = 0;
    br = 0;
  }
  if (tl + bl > height) {
    tl = 0;
    bl = 0;
  }
  if (tr + br > height) {
    tr = 0;
    br = 0;
  }

  path.move(0, tl);

  if (tl > 0) {
    path.arc(tl, -tl);
  }
  path.line(width - (tr + tl), 0);

  if (tr > 0) {
    path.arc(tr, tr);
  }
  path.line(0, height - (tr + br));

  if (br > 0) {
    path.arc(-br, br);
  }
  path.line(-width + (br + bl), 0);

  if (bl > 0) {
    path.arc(-bl, -bl);
  }
  path.line(0, -height + (bl + tl));

  return (
    <Shape
      x={Number(props.x)}
      y={Number(props.y)}
      opacity={Number(props.opacity) || 1}
      fill={props.fill}
      d={path}
      rotation={props.rotation}
      stroke={props.stroke}
      strokeWidth={props['stroke-width']}
    />
  );
}

/**
 * Applies svg props straight to an art shape
 */
export function Path(props) {
  return (
    <Shape
      d={props['d']}
      stroke={props['stroke']}
      fill={props['fill'] === 'none' ? undefined : props['fill']}
      strokeWidth={props['stroke-width']}
      fillRule={props['fill-rule']}
      clipRule={props['clip-rule']}
      opacity={props['opacity']}
      scale={props.scale}
      scaleX={
        props.scale && props.scale !== 1 ? undefined : Number(props.scaleX || 1)
      }
      scaleY={
        props.scale && props.scale !== 1 ? undefined : Number(props.scaleY || 1)
      }
      x={Number(props.x)}
      y={Number(props.y)}
      rotation={props.rotation}
    />
  );
}
