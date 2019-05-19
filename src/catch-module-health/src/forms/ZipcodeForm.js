import React from 'react';
import { View, Text } from 'react-native';
import { Field, reduxForm } from 'redux-form';

import { ReduxInput, colors, styles as st } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

import { CountiesOptions } from '../components';

const formName = 'zipcodeForm';

export function normalizeZipCode(value, previousValue) {
  if (value && value.length > 5) {
    return value.slice(0, 5);
  }
  return value;
}

export function zipcodeFormValidator(values, props) {
  const { zipcode } = values;
  if (!values.zipcode || values.zipcode.length !== 5) {
    return {
      zipcode: 'Please enter a valid zip code',
    };
  }
}

export const ZipcodeForm = ({
  counties,
  zipcodeInvalid,
  matchMultiple,
  countyName,
  stateName,
  viewport,
  valid,
}) => (
  <React.Fragment>
    <Field
      name="zipcode"
      component={ReduxInput}
      placeholder="00000"
      confirmable={false}
      keyboardType={Env.isNative ? 'numeric' : undefined}
      normalize={normalizeZipCode}
      showError={false}
      style={{
        fontWeight: '500',
        fontSize: 28,
        letterSpacing: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        width: 170,
        textAlign: 'center',
      }}
      white
    />
    {valid &&
      !matchMultiple &&
      !!countyName && (
        <Text style={st.get(['Body', 'CenterText'], viewport)}>
          {countyName}, {stateName}
        </Text>
      )}
    {zipcodeInvalid && (
      <Text style={st.get(['Body', 'Warning', 'CenterText'], viewport)}>
        Please enter a valid zip code
      </Text>
    )}
    {matchMultiple && (
      <Field
        name="county"
        component={CountiesOptions}
        viewport={viewport}
        counties={counties}
      />
    )}
  </React.Fragment>
);

export default reduxForm({
  form: formName,
  validate: zipcodeFormValidator,
  destroyOnUnmount: false,
  enableReinitialize: true,
})(ZipcodeForm);
