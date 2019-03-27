import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';

import { ReduxInput, InfoTooltip } from '@catch/rio-ui-kit';
import {
  createValidator,
  updateFilingStatusForm,
  formatCurrency,
  ensureZero,
  normalizeCurrency,
  Env,
} from '@catch/utils';

const PREFIX = 'catch.user.SpouseIncomeField';
export const COPY = {
  label: <FormattedMessage id={`${PREFIX}.label`} />,
  info: <FormattedMessage id={`${PREFIX}.tooltip`} />,
};

export const SpouseIncomeField = ({
  intl: { formatMessage },
  white,
  hideTooltip,
  onEnter,
}) => (
  <Field
    white={white}
    name="spouseIncome"
    qaName="spouseIncome"
    component={ReduxInput}
    format={val => formatCurrency(val)}
    parse={val => ensureZero(normalizeCurrency(val))}
    confirmable={false}
    placeholder={formatMessage({
      id: `${PREFIX}.placeholder`,
    })}
    label={COPY['label']}
    extraLabel={!hideTooltip && <InfoTooltip body={COPY['info']} />}
    onSubmit={onEnter}
    keyboardType={Env.isNative ? 'number-pad' : undefined}
  />
);

const withReduxForm = reduxForm({
  destroyOnUnmount: false,
  validate: createValidator(updateFilingStatusForm),
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

const Component = enhance(SpouseIncomeField);

Component.displayName = 'SpouseIncomeField';

export default Component;
