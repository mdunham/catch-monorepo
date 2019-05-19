import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView } from 'react-native';

import { Button, styles } from '@catch/rio-ui-kit';

const isLast = (index, length) => index === length - 1;

/**
 * CenterFrame centers content inside a wide white frame in desktop
 * and lays out buttons based on actions passed in an array
 * in mobile viewport it renders buttons in a bottom bar
 */
const CenterFrame = ({ children, actions, breakpoints }) => (
  <View style={styles.get('CenterFrameWide', breakpoints.current)}>
    <View style={styles.get('SmMargins')}>{children}</View>
    {!!actions && (
      <View
        style={styles.get(
          [
            'ContainerRow',
            'CenterRow',
            'TopGutter',
            'Margins',
            breakpoints.select({ PhoneOnly: 'BottomBar' }),
          ],
          breakpoints.current,
        )}
      >
        {actions.map((a, i) => (
          <View
            key={`action-${i}`}
            style={styles.get([
              breakpoints.select({ PhoneOnly: 'Flex1' }),
              isLast(i, actions.length) ? undefined : 'RightGutter',
            ])}
          >
            <Button
              viewport={breakpoints.current}
              wide={breakpoints.select({ PhoneOnly: true })}
              onClick={a.onPress}
              light={actions.length > 1 && i === 0}
            >
              {a.text}
            </Button>
          </View>
        ))}
      </View>
    )}
  </View>
);

CenterFrame.propTypes = {
  actions: PropTypes.array,
  children: PropTypes.node,
  breakpoints: PropTypes.object.isRequired,
};

export default CenterFrame;
