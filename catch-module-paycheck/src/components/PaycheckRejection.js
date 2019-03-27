import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { Blob, Text, styles, Spinner } from '@catch/rio-ui-kit';

class PaycheckRejection extends React.PureComponent {
  static propType = {
    viewport: PropTypes.string,
    loading: PropTypes.bool,
    isW2: PropTypes.bool,
  };
  componentDidMount() {
    const { onReject } = this.props;
    if (onReject) {
      onReject();
    }
  }
  render() {
    const { viewport, loading, isW2 } = this.props;
    return isW2 ? (
      <View style={styles.get(['CenterColumn', 'LgBottomGutter'])}>
        <Blob name="check" color="moss" style={styles.get('LgTopGutter')} />
        <Text size={18} weight="bold" center>
          You’re all set.
        </Text>
        <Text size={18} center>
          Your employer already takes taxes from W2 paychecks.
        </Text>
      </View>
    ) : (
      <View style={styles.get(['CenterColumn', 'LgBottomGutter'])}>
        <Blob name="thumb" color="wave" style={styles.get('LgTopGutter')} />
        <Text size={18} weight="bold" center>
          Not a paycheck. Got it.
        </Text>
        <Text size={18} center>
          We won't set anything aside.
        </Text>
      </View>
    );
  }
}

export default PaycheckRejection;
