import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { StyleSheet, View } from 'react-native';

import { ReduxInput, styles as st } from '@catch/rio-ui-kit';
import { PhoneNumberField } from '@catch/common';
import { createValidator, walletInput } from '@catch/utils';

const formName = 'WalletInputForm';

export const WalletInputForm = ({ viewport, ...rest }) => (
  <React.Fragment>
    <Field
      id="carrier"
      qaName="carrier"
      name="carrier"
      label="Insurance provider"
      component={ReduxInput}
      confirmable={false}
    />
    <Field
      id="planName"
      qaName="planName"
      name="planName"
      label="Plan name"
      component={ReduxInput}
      confirmable={false}
    />
    <View style={st.get('Bilateral')}>
      <View style={styles.columnWidth}>
        <Field
          id="policyNumber"
          qaName="policyNumber"
          name="policyNumber"
          label="Policy number"
          component={ReduxInput}
          confirmable={false}
        />
      </View>
      <View style={styles.columnWidth}>
        <PhoneNumberField form={formName} destroyOnUnmount={false} />
      </View>
    </View>
    <Field
      id="notes"
      qaName="notes"
      name="notes"
      label="Notes"
      placeholder="Enter any extra info you’d like to store with your insurance details. For example, copay amounts."
      component={ReduxInput}
      confirmable={false}
      rows={4}
      multiline
    />
  </React.Fragment>
);

const styles = StyleSheet.create({
  columnWidth: {
    width: '47%',
  },
});

const withReduxForm = reduxForm({
  form: formName,
  validate: createValidator(walletInput),
});

const Component = withReduxForm(WalletInputForm);
Component.displayName = 'WalletInputForm';

export default Component;
