import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { ReduxInput } from '@catch/rio-ui-kit';
import {
  Env,
  formatCurrency,
  normalizeCurrency,
  createValidator,
  householdIncomeForm,
} from '@catch/utils';

import { Page } from '../components';

const PREFIX = 'catch.health.HouseholdIncomeForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
};

const HouseholdIncomeForm = ({ viewport, handleSubmit, loading, invalid }) => (
  <Page
    title={COPY['title']}
    subtitle={COPY['subtitle']}
    viewport={viewport}
    containTitle
    centerTitle
    centerBody
    actions={[
      {
        onClick: handleSubmit,
        disabled: invalid || loading,
        children: COPY['button'],
        qaName: 'Submit income form',
      },
    ]}
  >
    <Field
      name="totalHouseholdIncome"
      component={ReduxInput}
      format={formatCurrency}
      normalize={normalizeCurrency}
      keyboardType={Env.isNative ? 'numeric' : undefined}
      confirmable={false}
      style={{
        fontWeight: '500',
        fontSize: 28,
        letterSpacing: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16,
        width: 180,
        textAlign: 'center',
      }}
    />
  </Page>
);

export default reduxForm({
  form: 'householdIncomeForm',
  enableReinitialize: true,
  validate: createValidator(householdIncomeForm),
})(HouseholdIncomeForm);
