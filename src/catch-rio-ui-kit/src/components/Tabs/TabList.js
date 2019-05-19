import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import Box from '../Box';
import { colors } from '../../const';
import Tab from './Tab';

/**
 * TabList should contain a collection of Tabs and passes down the proper active
 * state and handlers to them.
 * They will be in column by default you can pass row prop if you want them in row
 */
const TabList = ({
  onTabClick,
  activeIdx,
  children,
  style,
  viewport,
  ...other
}) => (
  <View style={style}>
    <View style={styles.base}>
      {Children.map(children, (child, i) => {
        const onClick = () => {
          onTabClick(i);
        };

        if (child.type === Tab && activeIdx === i) {
          return cloneElement(child, {
            isActive: true,
            onClick,
          });
        } else if (child.type === Tab) {
          return cloneElement(child, {
            onClick,
          });
        } else {
          return child;
        }
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  base: {
    width: '100%',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: colors['ink+2'],
    flexDirection: 'row',
  },
});

TabList.propTypes = {
  /** The content to be rendered */
  children: PropTypes.node,
  /** ignore */
  onTabClick: PropTypes.func,
  /** ignore */
  activeIdx: PropTypes.number,
};

export default TabList;
