import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Stepper } from '@catch/rio-ui-kit';
import { createValidator, householdPeopleForm } from '@catch/utils';

import { Page } from '../components';

const PREFIX = 'catch.health.HouseholdPeopleForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  p2: <FormattedMessage id={`${PREFIX}.p2`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

const HouseholdPeopleForm = ({ viewport, handleSubmit, invalid, loading }) => (
  <Page
    title={COPY['title']}
    subtitle={COPY['p2']}
    viewport={viewport}
    containTitle
    centerTitle
    centerBody
    actions={[
      {
        onClick: handleSubmit,
        disabled: invalid || loading,
        children: COPY['button'],
        qaName: 'Submit household people form',
      },
    ]}
  >
    <Field name="totalPeopleHousehold" large component={Stepper} />
  </Page>
);

export default reduxForm({
  form: 'householdPeopleForm',
  enableReinitialize: true,
  validate: createValidator(householdPeopleForm),
})(HouseholdPeopleForm);
