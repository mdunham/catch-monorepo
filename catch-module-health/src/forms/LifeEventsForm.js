import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { LifeEventOptions } from '../components';

export default reduxForm({
  form: 'lifeEventsForm',
})(props => <Field name="lifeEvent" component={LifeEventOptions} {...props} />);
