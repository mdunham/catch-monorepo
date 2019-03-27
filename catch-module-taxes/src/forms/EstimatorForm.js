import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { ResultCard } from '@catch/common';
import { Percentage } from '@catch/utils';

export const TaxesEstimatorForm = ({
  percent,
  reccPaycheckPercentage,
  ...props
}) => (
  <Field
    name="paycheckPercentage"
    component={ResultCard}
    goalType="tax"
    headerText={
      <React.Fragment>
        <Percentage whole>{reccPaycheckPercentage}</Percentage> RECOMMENDED
      </React.Fragment>
    }
    percent={percent}
    {...props}
  />
);

TaxesEstimatorForm.propTypes = {
  percent: PropTypes.number,
  reccPaycheckPercentage: PropTypes.number,
};

const withRedux = reduxForm({
  form: 'TaxEstimatorForm',
});

const Component = withRedux(TaxesEstimatorForm);
Component.displayName = 'EstimatorForm';

export default Component;
