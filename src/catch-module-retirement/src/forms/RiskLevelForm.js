import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { H4, ReduxRadioGroup } from '@catch/rio-ui-kit';

import { formName } from '../const';
import { Option } from '../components';

const options = [
  { label: 'Withdraw my money', value: 'CONSERVATIVE' },
  { label: 'Deposit more money', value: 'AGGRESSIVE' },
  { label: 'Nothing', value: 'MODERATE' },
];

export class RiskLevelForm extends Component {
  render() {
    return (
      <Field name="riskLevel" component={ReduxRadioGroup}>
        {options.map((o, i) => {
          return (
            <Option key={`option-${i}`} mb={2} label={o.label} value={o.value}>
              <H4 px={2} py={2}>
                {o.label}
              </H4>
            </Option>
          );
        })}
      </Field>
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(RiskLevelForm);
