import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, View } from 'react-native';
import { FieldArray, Field, reduxForm } from 'redux-form';

import { phoneNumber } from '@catch/utils';

import DoctorsFormList from './DoctorsFormList';

const formName = 'AddDoctorsForm';

export const addDoctors = values => {
  const errors = {};
  if (!values.doctors || !values.doctors.length) {
    errors.doctors = { _error: 'At least one doctor must be entered' };
  } else {
    const doctorsArrayErrors = [];
    values.doctors.forEach((doctor, idx) => {
      const doctorErrors = {};
      if (!doctor || !doctor.type) {
        doctorErrors.type = 'Type of doctor is required';
        doctorsArrayErrors[idx] = doctorErrors;
      }

      if (doctor && doctor.type === 'OTHER' && !doctor.otherType) {
        doctorErrors.otherType = 'Type of doctor is required';
        doctorsArrayErrors[idx] = doctorErrors;
      }

      if (!doctor || !doctor.name) {
        doctorErrors.name = "Doctor's name is required";
        doctorsArrayErrors[idx] = doctorErrors;
      }

      if (!!phoneNumber(doctor.phoneNumber)) {
        doctorErrors.phoneNumber = 'Must be 10 digits';
        doctorsArrayErrors[idx] = doctorErrors;
      }
    });

    if (doctorsArrayErrors.length) {
      errors.doctors = doctorsArrayErrors;
    }
  }
  return errors;
};

export const AddDoctorsForm = ({ formValues, viewport }) => (
  <FieldArray
    formName={formName}
    name="doctors"
    component={DoctorsFormList}
    viewport={viewport}
    formValues={formValues}
  />
);

AddDoctorsForm.propTypes = {
  viewport: PropTypes.string.isRequired,
};

const withReduxForm = reduxForm({
  form: 'AddDoctorsForm',
  initialValues: {
    doctors: [{}],
  },
  validate: addDoctors,
  enableReinitialize: true,
});

const Component = withReduxForm(AddDoctorsForm);
Component.displayName = 'AddDoctorsForm';

export default Component;
