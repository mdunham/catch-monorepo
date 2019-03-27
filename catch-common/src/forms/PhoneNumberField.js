import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput } from '@catch/rio-ui-kit';
import { formatPhone } from '@catch/utils';

const PREFIX = 'catch.user.PhoneNumberField';

export const PhoneNumberField = ({
  intl: { formatMessage },
  onEnter,
  white,
  name,
}) => (
  <Field
    white={white}
    name={name}
    qaName={name}
    component={ReduxInput}
    label={formatMessage({ id: `${PREFIX}.label` })}
    placeholder={formatMessage({ id: `${PREFIX}.placeholder` })}
    format={formatPhone}
    onSubmit={onEnter}
    confirmable={false}
    keyboardType="phone-pad"
  />
);

PhoneNumberField.defaultProps = {
  name: 'phoneNumber',
};

const withReduxForm = reduxForm();
const enhance = compose(
  injectIntl,
  withReduxForm,
);
const Component = enhance(PhoneNumberField);

Component.displayName = 'PhoneNumberField';

export default Component;
