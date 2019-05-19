import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';

import TaxDependentCardField from './TaxDependentCardField';

const formName = 'UnaccountedTaxDependentsForm';

export const UnaccountedTaxDependentsForm = ({
  breakpoints,
  unaccountedTaxDependents,
  initialValues,
}) => (
  <React.Fragment>
    {Object.keys(initialValues).map((val, idx) => (
      <TaxDependentCardField
        key={`unaccounted_${idx}`}
        id={`unaccounted_${idx}`}
        name={`unaccounted_${idx}`}
        breakpoints={breakpoints}
        form={formName}
        hideDivider={idx === unaccountedTaxDependents - 1}
        fakePerson
      />
    ))}
  </React.Fragment>
);

UnaccountedTaxDependentsForm.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  unaccountedTaxDependents: PropTypes.number.isRequired,
  initialValues: PropTypes.object.isRequired,
};

const withRedux = reduxForm({
  form: formName,
});
const Component = withRedux(UnaccountedTaxDependentsForm);
Component.displayName = formName;

export default Component;
