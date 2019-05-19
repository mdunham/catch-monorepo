import React from 'react';
import { Field, reduxForm } from 'redux-form';

import {
  ensureZero,
  normalizeCurrency,
  formatCurrency,
  Env,
} from '@catch/utils';
import { ReduxInput, fonts } from '@catch/rio-ui-kit';

export const SuggestedIncomeForm = ({ viewport }) => (
  <Field
    name="amount"
    qaName="amount"
    component={ReduxInput}
    format={formatCurrency}
    parse={val => ensureZero(normalizeCurrency(val))}
    confirmable={false}
    keyboardType={Env.isNative ? 'numeric' : undefined}
    style={{
      textAlign: 'center',
      fontSize: viewport === 'PhoneOnly' ? 28 : fonts.large,
      width: viewport === 'PhoneOnly' ? 280 : '100%',
    }}
  />
);

export default reduxForm({
  form: 'SuggestedIncomeForm',
})(SuggestedIncomeForm);
