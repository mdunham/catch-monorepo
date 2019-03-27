import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { WalletSurveyOptions } from '../components';

export const WalletSurveyForm = ({ breakpoints, options, viewport }) => (
  <Field
    id="insuranceSource"
    qaName="insuranceSource"
    name="insuranceSource"
    breakpoints={breakpoints}
    component={WalletSurveyOptions}
    options={options}
    viewport={viewport}
  />
);

WalletSurveyForm.propTypes = {
  breakpoints: PropTypes.object,
  options: PropTypes.object.isRequired,
  viewport: PropTypes.string,
};

const withReduxForm = reduxForm({
  form: 'WalletSurveyForm',
  enableReinitialize: true,
});

const Component = withReduxForm(WalletSurveyForm);
Component.displayName = 'WalletSurveyForm';

export default Component;
