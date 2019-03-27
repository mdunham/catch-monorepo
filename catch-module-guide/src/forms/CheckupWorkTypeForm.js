import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { PlanCheckupOptions } from '../components';

export default reduxForm({
  form: 'workTypeCheckup',
  destroyOnUnmount: false,
  forceUnregisterOnUnmount: true,
})(props => (
  <Field
    {...props}
    name="workType"
    component={PlanCheckupOptions}
    question="Confirm your employment type"
    answers={[
      {
        id: 'WORK_TYPE_W2',
        text: 'Full-time employee',
        subtitle: 'I receive a W2 for taxes',
      },
      {
        id: 'WORK_TYPE_1099',
        text: 'Independent contractor',
        subtitle: 'I receive a 1099 for taxes',
      },
      {
        id: 'WORK_TYPE_DIVERSIFIED',
        text: 'Employee with a side gig',
        subtitle: 'I receive both a W2 and a 1099',
      },
    ]}
  />
));
