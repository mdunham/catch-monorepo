import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

import { ReduxSlider } from '@catch/rio-ui-kit';

import { formName } from '../const';

export class PaycheckPercentageForm extends Component {
  state = { value: 0 };

  componentDidMount() {
    this.setState({ value: this.props.initialValues.paycheckPercentage });
  }
  render() {
    return (
      <Field
        name="paycheckPercentage"
        label="Paycheck Percentage"
        component={ReduxSlider}
        min={0}
        max={1}
        step={0.01}
        value={parseFloat(this.state.value)}
      />
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(PaycheckPercentageForm);
