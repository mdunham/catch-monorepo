import React from 'react';
import PropTypes from 'prop-types';
import merge from 'lodash.merge';
import { View, StyleSheet, Platform } from 'react-native';
import { width, spaceToScale, isDeprecated } from './util';
import { colors } from '../../const';

const REG = /^([wmp][trblxy]?|flex|absolute|wrap|row|align|justify|order)$/;
const dec = (key, val) => ({ [key]: val });

const modifiers = {
  wrap: (key, n) => dec('flexWrap', n ? 'wrap' : 'nowrap'),
  flex: (key, n) => dec('flex', n),
  row: (key, n) => dec('flexDirection', n ? 'row' : 'column'),
  align: (key, n) => dec('alignItems', n),
  justify: (key, n) => dec('justifyContent', n),
  order: (key, n) => dec('order', n), //Test behavior in native
  absolute: (key, n) => dec('position', n ? 'absolute' : 'relative'),
  w: width,
  m: spaceToScale,
  p: spaceToScale,
};
export const createStyles = props => {
  let finalStyles = {};
  for (let key in props) {
    if (REG.test(key)) {
      const val = props[key];
      if (Array.isArray(val)) {
        const style = modifiers[key] || modifiers[key.charAt(0)];
        finalStyles = merge({}, finalStyles, style(key, val));
      } else {
        const style = modifiers[key] || modifiers[key.charAt(0)];
        finalStyles.base = merge({}, finalStyles.base, style(key, val));
      }
    }
  }
  return finalStyles;
};

/**
 * For testing purposes as React Context API breaks enzyme
 */
const Box = ({
  id,
  children,
  debug,
  dev,
  style,
  screen,
  qaName,
  pointerEvents,
  onLayout,
  ...styleProps
}) => {
  const others = StyleSheet.flatten(style);
  const styles = StyleSheet.create({
    ...createStyles(styleProps),
    others,
    web: Platform.select({
      web: {
        maxWidth: '100%',
        boxSizing: 'border-box',
      },
    }),
    debug: {
      borderWidth: 0,
      borderStyle: 'solid',
      borderColor: '#3671F1',
      backgroundColor: 'rgba(54,113,241,0.2)',
    },
    dev: {
      borderColor: colors.ink,
      borderStyle: 'dashed',
      borderWidth: 1,
    },
  });
  return (
    <View
      id={id}
      accessibilityLabel={qaName}
      style={[
        Platform.select({
          web: styles.web,
        }),
        styles.others,
        styles.base,
        styles[screen],
        debug && styles.debug,
        dev && styles.dev,
      ]}
      pointerEvents={pointerEvents}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
};

Box.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  style: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
    PropTypes.number,
  ]),
  /** Unit for the flex sizing */
  flex: PropTypes.number,
  /** If true, this element will have flex wrap enabled */
  wrap: PropTypes.bool,
  /** If true, this element will have flex (change from column bc of native) */
  row: PropTypes.bool,
  /** How to align elements */
  align: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'stretch',
    'baseline',
  ]),
  /** How to justify elements */
  justify: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  /** Order to use if wrap is enabled */
  order: PropTypes.number,
  /** Css position property to use */
  position: PropTypes.oneOf(['absolute', 'relative']),
  /** Width of the element */
  w: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  /** Margin of the element */
  m: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  /** Padding of the element */
  p: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
  /* Gives a viewport size to render breakpoints*/
  screen: PropTypes.string,
  /* measure layout view method */
  onLayout: PropTypes.func,
};

export default Box;
