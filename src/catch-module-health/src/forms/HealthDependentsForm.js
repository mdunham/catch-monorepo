import React from 'react';
import { FieldArray, reduxForm, formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Page } from '../components';

import DependentsList from './DependentsList';

const PREFIX = 'catch.health.HealthDependentsForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  buttonSingular: <FormattedMessage id={`${PREFIX}.buttonSingular`} />,
  buttonPlural: values => (
    <FormattedMessage id={`${PREFIX}.buttonPlural`} values={values} />
  ),
};

const formName = 'healthDependentsForm';

function validateDependents(values) {
  const errors = {};
  if (values.dependents) {
    const depArrayErrors = [];
    values.dependents.forEach((dep, i) => {
      if (!dep || dep.age === '') {
        depArrayErrors[i] = {
          age: 'Required',
        };
      }
      if (dep && /\D/.test(dep.age)) {
        depArrayErrors[i] = {
          age: 'Number only, please',
        };
      }
    });
    if (depArrayErrors.length) {
      errors.dependents = depArrayErrors;
    }
  }
  return errors;
}

const HealthDependentsForm = ({
  viewport,
  handleSubmit,
  dependents,
  invalid,
  loading,
}) => (
  <Page
    title={COPY['title']}
    viewport={viewport}
    narrowTitle
    centerTitle
    centerBody
    actions={[
      {
        onClick: handleSubmit,
        disabled: invalid || loading,
        children:
          dependents && dependents.length > 1
            ? COPY['buttonPlural']({ number: dependents.length })
            : COPY['buttonSingular'],
      },
    ]}
  >
    <FieldArray
      viewport={viewport}
      name="dependents"
      component={DependentsList}
    />
  </Page>
);

const withForm = reduxForm({
  form: formName,
  enableReinitialize: true,
  validate: validateDependents,
});

const withRedux = connect(state => ({
  dependents: formValueSelector(formName)(state, 'dependents'),
}));

const enhance = compose(
  withForm,
  withRedux,
);

export default enhance(HealthDependentsForm);
