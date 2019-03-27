import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import { Blob, Text, styles, Spinner } from '@catch/rio-ui-kit';
import { Currency, LongFormDate } from '@catch/utils';

/**
 * PaycheckIntro is a presentational component focused only on
 * formatting and laying out the data it is passed
 */
const PaycheckIntro = ({ viewport, amount, date, description, loading }) => (
  <View style={styles.get(['CenterColumn', 'LgBottomGutter'])}>
    <Blob name="chaching" color="moss" />
    <Text size={18} center mt={2}>
      You received a new bank deposit.
    </Text>
    <Text size={18} weight="bold" center>
      Was this a paycheck?
    </Text>
    {loading ? (
      <View style={styles.get('LgTopGutter')}>
        <Spinner large />
      </View>
    ) : (
      <React.Fragment>
        <Text size={24} weight="bold" color="moss" center mt={4}>
          <Currency>{amount}</Currency>
        </Text>
        <Text weight="medium" mt={1}>
          <LongFormDate>{date}</LongFormDate>
        </Text>
        <Text size="small" color="charcoal--light1" mt={1}>
          {description}
        </Text>
      </React.Fragment>
    )}
  </View>
);

PaycheckIntro.propTypes = {
  viewport: PropTypes.string,
  amount: PropTypes.number,
  date: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
};

export default PaycheckIntro;
