/**
 * TransferFundsForm
 *
 * This form is used during the 'config' step of withdrawing or depositing funds to/froma Catch account
 * It expects the form's value to be passed in as a prop for validation purposes.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import {
  ensureZero,
  normalizeCurrency,
  formatCurrency,
  Env,
} from '@catch/utils';
import { ReduxInput, colors, fonts } from '@catch/rio-ui-kit';

export const TransferFundsForm = ({
  adjustHeight,
  formValue,
  isFormValid,
  transferType,
}) => (
  <Field
    name="transferAmount"
    format={formatCurrency}
    parse={val => ensureZero(normalizeCurrency(val))}
    component={ReduxInput}
    confirmable={false}
    keyboardType={Env.isNative ? 'numeric' : undefined}
    placeholder="$0.00"
    grouped
    style={{
      color: isFormValid
        ? formValue === 0
          ? colors['ink+1']
          : colors.ink
        : colors.coral,
      textAlign: 'right',
      fontWeight: fonts.medium,
      fontSize: 18,
      lineHeight: 21,
      borderColor: colors['sage'],
      backgroundColor: colors['ink+4'],
    }}
  />
);

TransferFundsForm.propTypes = {
  formValue: PropTypes.number,
  isFormValid: PropTypes.bool.isRequired,
};

TransferFundsForm.defaultProps = {
  formValue: 0,
};

const withForm = reduxForm({
  form: 'TransferFundsForm',
  enableReinitailize: true,
  destroyOnUnmount: false,
});

const Component = withForm(TransferFundsForm);
Component.displayName = 'TransferFundsForm';

export default Component;
