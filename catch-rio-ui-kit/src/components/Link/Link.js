import React from 'react';
import PropTypes from 'prop-types';
import { Link as RRLink } from 'react-router-dom';
import { createElement } from 'react-native-web';
import { StyleSheet } from 'react-native';

import { colors, fontColors, fonts } from '../../const';

const Link = ({ children, to, onClick, style, newTab, ...other }) =>
  createElement(RRLink, {
    children,
    target: newTab ? '_blank' : undefined,
    to,
    onClick,
    style: Array.isArray(style)
      ? [styles.base, ...style]
      : [styles.base, style],
    ...other,
  });

Link.propTypes = {
  children: PropTypes.node,
  newTab: PropTypes.bool,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  onClick: PropTypes.func,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Link.defaultProps = {
  newTab: false,
  onClick: () => {},
};

const styles = StyleSheet.create({
  base: {
    color: fontColors.link,
    fontFamily: fonts.primary,
    fontWeight: fonts.medium,
    fontSize: 15,
  },
});

export default Link;
