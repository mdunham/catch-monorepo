import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { PhoneNumberField } from '@catch/common';
import { ReduxInput } from '@catch/rio-ui-kit';

import DoctorTypeField from './DoctorTypeField';

export const DoctorForm = ({
  formValues,
  initialValues,
  name,
  type,
  otherType,
  phoneNumber,
  form,
  idx,
  isDirty,
  isEditing,
}) => (
  <React.Fragment>
    <DoctorTypeField destroyOnUnmount={false} name={type} form={form} />
    {(isEditing
      ? isDirty
        ? formValues && formValues.type === 'OTHER'
        : !!initialValues.otherType
      : formValues &&
        formValues.doctors &&
        formValues.doctors[idx].type === 'OTHER') && (
      <Field
        form={form}
        name={otherType}
        component={ReduxInput}
        label="Enter type of doctor"
        confirmable={false}
        destroyOnUnmount={false}
      />
    )}

    <Field
      form={form}
      name={name}
      component={ReduxInput}
      label="Doctor's name"
      confirmable={false}
      destroyOnUnmount={false}
    />
    <PhoneNumberField destroyOnUnmount={false} name={phoneNumber} form={form} />
  </React.Fragment>
);

DoctorForm.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  form: PropTypes.string.isRequired,
};

const withRedux = reduxForm({
  destroyOnUnmount: false,
  enableReinitialize: true,
});
const Component = withRedux(DoctorForm);
Component.displayName = 'DoctorForm';

export default Component;
