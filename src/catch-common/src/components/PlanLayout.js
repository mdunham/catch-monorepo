import React from 'react';
import { View } from 'react-native';

import { styles } from '@catch/rio-ui-kit';

const PlanLayout = ({ breakpoints, children, style }) => (
  <View
    style={styles.get(
      [
        'FluidContainer',
        breakpoints.select({
          'TabletLandscapeUp|TabletPortraitUp': 'XlTopGutter',
        }),
        style,
      ],
      breakpoints.current,
    )}
  >
    {children}
  </View>
);

PlanLayout.Column = ({ breakpoints, children, style }) => (
  <View
    style={styles.get(
      ['Flex1', 'LgTopGutter', 'CenterColumn', style],
      breakpoints.current,
    )}
  >
    {children}
  </View>
);

export default PlanLayout;
