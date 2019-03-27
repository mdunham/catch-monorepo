import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { H4, ReduxRadioGroup } from '@catch/rio-ui-kit';

import { formName } from '../const';
import { Option } from '../components';

const options = [
  { label: 'Very little risk', value: 'LESS_RISKY' },
  { label: 'Average risk', value: 'NEUTRAL' },
  { label: 'As much risk as possible', value: 'MORE_RISKY' },
];

export class RiskComfortForm extends Component {
  render() {
    return (
      <Field name="riskComfort" component={ReduxRadioGroup}>
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
})(RiskComfortForm);
