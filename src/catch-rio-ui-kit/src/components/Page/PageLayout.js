import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';

import styles from '../../styles';

const PageLayout = ({ children, viewport, style }) => (
  <View style={styles.get('CenterColumn')}>
    <View
      style={styles.get(
        ['Margins', 'PageWrapper', 'FullWidth', style],
        viewport,
      )}
    >
      {children}
    </View>
  </View>
);

PageLayout.propTypes = {
  children: PropTypes.node,
  viewport: PropTypes.string,
};

export default PageLayout;
