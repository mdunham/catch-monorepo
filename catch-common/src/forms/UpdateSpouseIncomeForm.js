import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import {
  createValidator,
  updateSpouseIncomeForm,
  formatCurrency,
  ensureZero,
  normalizeCurrency,
  Env,
} from '@catch/utils';
import { Box, Text, ReduxInput } from '@catch/rio-ui-kit';

import { Label } from '../components';

const PREFIX = 'catch.util.forms.UpdateSpouseIncomeForm';
export const COPY = {
  spouseIncomeLabel: <FormattedMessage id={`${PREFIX}.spouseIncomeLabel`} />,
};

export class UpdateSpouseIncomeForm extends Component {
  render() {
    return (
      <Box>
        <Label>{COPY['spouseIncomeLabel']}</Label>
        <Field
          name="spouseIncome"
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

const formName = 'UpdateSpouseIncomeForm';

export default reduxForm({
  form: formName,
  validate: createValidator(updateSpouseIncomeForm),
})(UpdateSpouseIncomeForm);
