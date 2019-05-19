import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';

import ListItemAction from './ListItemAction';
import Box from '../Box';
import Hoverable from '../Hoverable';
import { fonts, fontColors, colors } from '../../const';

/**
 * Accessible item component for native and web
 */
const ListItem = ({
  children,
  divider,
  disabled,
  isHighlighted,
  isLast,
  onClick,
  style,
  ...other
}) => {
  // Ensure children can act like a JS array
  const childrenArray = Children.toArray(children);
  const hasAction =
    childrenArray.length &&
    childrenArray[childrenArray.length - 1].type === ListItemAction;

  const styleArray = [
    styles.base,
    disabled && styles.disabled,
    divider && !isLast && styles.divider,
    isHighlighted && styles.isHighlighted,
    isLast && styles.last,
  ];

  return typeof onClick === 'function' ? (
    <Hoverable>
      {isHovered => (
        <TouchableOpacity
          onPress={onClick}
          accessible={true}
          accessibilityRole={Platform.select({ web: 'option' })}
          style={styleArray.concat([isHovered && styles.hovered])}
          {...other}
        >
          {childrenArray.length > 1
            ? childrenArray
            : isHovered
              ? React.cloneElement(children, {
                  primaryProps: { color: colors.ink },
                })
              : children}
          {hasAction && <Box ml={1}>{childrenArray.pop()}</Box>}
        </TouchableOpacity>
      )}
    </Hoverable>
  ) : (
    <Box style={styleArray} {...other}>
      {childrenArray}
    </Box>
  );
};

ListItem.propTypes = {
  /** The content to be rendered */
  children: PropTypes.node,
  /** If true, there will be a border on bottom of list item */
  divider: PropTypes.bool,
  /** If true, item will be disabled */
  disabled: PropTypes.bool,
  /** If true, item will be highlighted */
  isHighlighted: PropTypes.bool,
  /** Optional handler for when list item is clicked */
  onClick: PropTypes.func,
};

ListItem.defaultProps = {
  divider: true,
  disabled: false,
};

export const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 12,
    paddingRight: 8,
    paddingBottom: 12,
    paddingLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray5,
  },
  isHighlighted: {
    backgroundColor: colors.gray5,
  },
  hovered: {
    backgroundColor: colors.sage,
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ListItem;
