import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { ReduxInput, colors } from '@catch/rio-ui-kit';

import { formName } from '../const';
import {
  ensureZero,
  normalizeCurrency,
  formatCurrency,
  Env,
} from '@catch/utils';

export class ExternalSavingsForm extends Component {
  render() {
    return (
      <Field
        name="externalSavings"
        component={ReduxInput}
        format={val => formatCurrency(val)}
        parse={val => ensureZero(normalizeCurrency(val))}
        confirmable={false}
        keyboardType={Env.isNative ? 'numeric' : undefined}
        style={{
          fontWeight: '500',
          fontSize: 28,
          letterSpacing: 1,
          paddingTop: 16,
          paddingBottom: 16,
          paddingLeft: 16,
          paddingRight: 16,
          color: this.props.currentValue === 0 ? colors.smoke : colors.charcoal,
        }}
        white
      />
    );
  }
}

export default reduxForm({
  form: formName,
  destoryOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(ExternalSavingsForm);
