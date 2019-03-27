import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import {
  Blob,
  Text,
  styles,
  ReduxRadioGroup,
  OptionCard,
} from '@catch/rio-ui-kit';

/**
 * PaycheckTriage is a form with the same name as the paycheck breakdown
 * in order to combine the values on submit. The OptionCard also trigger onNext
 * in order to move on to the next screen when the user select an option
 */
export const PaycheckTriage = ({ viewport, onNext }) => (
  <View style={styles.get(['FullWidth', 'ContentMax'])}>
    <View style={styles.get('CenterColumn')}>
      <Blob name="suitcase" color="wave" />
    </View>
    <Text size={18} center mt={2}>
      Awesome!
    </Text>
    <Text size={18} weight="bold" center mb={4}>
      What was this paycheck for?
    </Text>
    <Field component={ReduxRadioGroup} name="paycheckType">
      <OptionCard
        simple
        onClick={onNext}
        title="Full-time work"
        subtitle="Mark as W2 income"
        style={{ minWidth: 300 }}
        value="PAYCHECK_TYPE_W2"
        mb={1}
      />
      <OptionCard
        simple
        onClick={onNext}
        title="Contract work"
        subtitle="Mark as 1099 income"
        style={{ minWidth: 300 }}
        value="PAYCHECK_TYPE_1099"
      />
    </Field>
  </View>
);

export default reduxForm({
  form: 'paycheckSettings',
  destroyOnUnmount: false,
  enableReinitialize: true,
})(PaycheckTriage);
