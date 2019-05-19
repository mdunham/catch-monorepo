import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput } from '@catch/rio-ui-kit';

const PREFIX = 'catch.user.EmployerNameField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
};

export const EmployerNameField = ({ white }) => (
  <Field
    name="employerName"
    qaName="employerName"
    component={ReduxInput}
    label={COPY['label']}
    white={white}
    confirmable={false}
  />
);

EmployerNameField.propType = {
  white: PropTypes.bool,
};

EmployerNameField.defaultProps = {
  white: false,
};

const withReduxForm = reduxForm();

const Component = withReduxForm(EmployerNameField);
Component.displayName = 'EmployerNameField';

export default Component;
