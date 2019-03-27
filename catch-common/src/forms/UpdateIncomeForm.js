import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  createValidator,
  updateIncomeForm,
  formatCurrency,
  ensureZero,
  normalizeCurrency,
  Env,
} from '@catch/utils';
import { Box, Text, ReduxInput } from '@catch/rio-ui-kit';

import { Label } from '../components';

const PREFIX = 'catch.util.forms.UpdateIncomeForm';
export const COPY = {
  estimatedIncomeLabel: (
    <FormattedMessage id={`${PREFIX}.estimatedIncomeLabel`} />
  ),
};

export class UpdateIncomeForm extends Component {
  render() {
    return (
      <Box>
        <Label>{COPY['estimatedIncomeLabel']}</Label>
        <Field
          name="estimatedIncome"
          component={ReduxInput}
          format={val => formatCurrency(val)}
          parse={val => ensureZero(normalizeCurrency(val))}
          confirmable={false}
          keyboardType={Env.isNative ? 'number-pad' : undefined}
        />
      </Box>
    );
  }
}

const formName = 'UpdateIncomeForm';

export default reduxForm({
  form: formName,
  validate: createValidator(updateIncomeForm),
})(UpdateIncomeForm);
