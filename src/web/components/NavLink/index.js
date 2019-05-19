import React from 'react';
import PropTypes from 'prop-types';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { StyleSheet, createElement } from 'react-native-web';
import { Hoverable, fonts, colors } from '@catch/rio-ui-kit';

const NavLink = ({
  style,
  noFade,
  children,
  to,
  exact,
  onClick,
  external,
  noMargin,
  id,
}) => (
  <Hoverable>
    {isHovered =>
      external
        ? createElement('a', {
            href: to,
            children,
            target: '_blank',
            style: [styles.base, style, isHovered && styles.hover],
          })
        : createElement(RouterNavLink, {
            to,
            exact,
            id,
            children,
            style: [
              styles.base,
              noFade && styles.noFade,
              noMargin && styles.noMargin,
              style,
              isHovered && styles.hover,
            ],
            activeStyle: { opacity: 1 },
            onClick,
          })
    }
  </Hoverable>
);

NavLink.propTypes = {
  children: PropTypes.node,
  isActive: PropTypes.bool,
  to: PropTypes.string,
  exact: PropTypes.bool,
  onClick: PropTypes.func,
  id: PropTypes.string,
};

NavLink.defaultProps = {
  onClick: () => {},
  external: false,
};

const styles = StyleSheet.create({
  base: {
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: fonts.nav,
    fontWeight: fonts.medium,
    fontFamily: fonts.primary,
    cursor: 'default',
    color: colors.ink,
    opacity: 0.5,
    marginRight: 36,
  },
  noFade: {
    color: colors.gray1,
  },
  active: {
    color: colors.navbarLinkActive,
  },
  noMargin: {
    marginRight: 0,
  },
  hover: {
    color: colors.navbarLinkActive,
  },
});

export default NavLink;
