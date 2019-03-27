import React from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

import { Blob, Text, styles } from '@catch/rio-ui-kit';
import { NumericDate } from '@catch/utils';

const isSkipped = action => action === 'INCOME_ACTION_SKIPPED';

const PaycheckProcessed = ({ incomeAction, date, onInfo }) => (
  <View style={styles.get(['Container', 'ContentMax', 'LgBottomGutter'])}>
    <View style={styles.get(['CenterColumn'])}>
      {isSkipped(incomeAction) ? (
        <Blob name="thumb" color="wave" />
      ) : (
        <Blob name="planpig" color="moss" />
      )}
    </View>
    <Text size={18} center mt={2}>
      You already marked this deposit as{' '}
      {isSkipped(incomeAction) ? (
        <Text weight="bold" size={18}>
          not a paycheck
        </Text>
      ) : (
        <React.Fragment>
          a{' '}
          <Text weight="bold" size={18}>
            paycheck
          </Text>
        </React.Fragment>
      )}{' '}
      on <NumericDate>{date}</NumericDate>
    </Text>
    {!isSkipped(incomeAction) && (
      <TouchableOpacity onPress={onInfo} style={styles.get('LgTopGutter')}>
        <Text color="link" weight="medium" center>
          Plan contribution details
        </Text>
      </TouchableOpacity>
    )}
  </View>
);

PaycheckProcessed.propTypes = {
  onInfo: PropTypes.func,
  incomeAction: PropTypes.string.isRequired,
  date: PropTypes.string,
};

export default PaycheckProcessed;
