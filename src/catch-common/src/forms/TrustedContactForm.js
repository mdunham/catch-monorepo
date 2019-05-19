import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Fine, ReduxInput } from '@catch/rio-ui-kit';
import { createValidator, trustedContact, formatPhone } from '@catch/utils';

const PREFIX = 'catch.user.TrustedContactForm';
export const COPY = {
  disclosure: <FormattedMessage id={`${PREFIX}.disclosure`} />,
};

export const TrustedContactForm = () => (
  <React.Fragment>
    <Field
      component={ReduxInput}
      qaName="tcName"
      name="tcName"
      label="Name"
      confirmable={false}
    />
    <Field
      component={ReduxInput}
      qaName="tcEmail"
      name="tcEmail"
      label="Email address"
      confirmable={false}
      keyboardType="email-address"
    />
    <Field
      component={ReduxInput}
      qaName="tcPhoneNumber"
      name="tcPhoneNumber"
      label="Phone number"
      format={formatPhone}
      confirmable={false}
      keyboardType="phone-pad"
    />
    <Fine>{COPY['disclosure']}</Fine>
  </React.Fragment>
);

const withReduxForm = reduxForm({
  form: 'UserInfo',
  validate: createValidator(trustedContact),
});

const Component = withReduxForm(TrustedContactForm);

Component.displayName = 'TrustedContactForm';

export default Component;
