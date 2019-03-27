import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { ReduxInput } from '@catch/rio-ui-kit';

const PREFIX = 'catch.user.EmailField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

export const EmailField = ({ onEnter }) => (
  <Field
    id="email"
    name="email"
    qaName="email"
    component={ReduxInput}
    label={COPY['label']}
    onSubmit={onEnter}
    autoComplete="off"
    confirmable={false}
    keyboardType="email-address"
  />
);

const Component = reduxForm()(EmailField);

Component.displayName = 'EmailField';

export default Component;
