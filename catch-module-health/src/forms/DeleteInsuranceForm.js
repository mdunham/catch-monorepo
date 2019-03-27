import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import { Text } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { ReduxRadioGroup, Radio, styles as st } from '@catch/rio-ui-kit';

const options = ['NEW_PLAN', 'NOT_COVERED'];

const PREFIX = 'catch.health.DeleteInsuranceForm';
export const COPY = {
  NEW_PLAN: <FormattedMessage id={`${PREFIX}.NEW_PLAN`} />,
  NOT_COVERED: <FormattedMessage id={`${PREFIX}.NOT_COVERED`} />,
};

export const DeleteInsuranceForm = ({ viewport, onChange, value }) => (
  <Field id="reason" name="reason" qaName="reason" component={ReduxRadioGroup}>
    {options.map((o, idx) => (
      <Radio
        key={`radio-${idx}`}
        onChange={() => onChange(o)}
        checked={value === o}
        mb={2}
        style={st.get('SmRightGutter')}
        value={o}
      >
        <Text style={st.get('Body', viewport)}>{COPY[o]}</Text>
      </Radio>
    ))}
  </Field>
);

DeleteInsuranceForm.propTypes = {
  viewport: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

const withReduxForm = reduxForm({
  form: 'DeleteInsuranceForm',
});

const Component = withReduxForm(DeleteInsuranceForm);
Component.displayName = 'DeleteInsuranceForm';

export default Component;
