import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';
import reduce from 'lodash.reduce';

import { Dropdown } from '@catch/rio-ui-kit';

const DOCTOR_TYPES = {
  DENTIST: 'Dentist',
  DERMATOLOGIST: 'Dermatologist',
  EAR_NOSE_THROAT: 'Ear, nose, & throat doctor',
  EYE_DOCTOR: 'Eye doctor',
  'OB-GYN': 'OB-GYN (Obstetrician-Gynecologist)',
  ORTHOPEDIC_SURGEON: 'Orthopedic surgeon',
  PEDIATRICIAN: 'Pediatrician',
  PRIMARY_CARE_PHYSICIAN: 'Primary care physician',
  PSYCHIATRIST: 'Psychiatrist',
  OTHER: 'Other',
};

const doctorTypeItems = reduce(
  DOCTOR_TYPES,
  (acc, value, key) => {
    acc.push({ label: value, value: key });
    return acc;
  },
  [],
);

export const DoctorTypeField = ({ form, name }) => (
  <Field
    name={name}
    component={Dropdown}
    label="Type of doctor"
    items={doctorTypeItems}
    placeholder="Select doctor specialty"
    form={form}
  />
);

const withReduxForm = reduxForm();

const Component = withReduxForm(DoctorTypeField);
Component.displayName = 'DoctorTypeField';

export default Component;
