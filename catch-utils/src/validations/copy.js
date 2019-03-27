import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.validations';

export const COPY = {
  date: <FormattedMessage id={`${PREFIX}.date`} />,
  baseRequire: <FormattedMessage id={`${PREFIX}.baseRequire`} />,
  tooYoung: values => (
    <FormattedMessage id={`${PREFIX}.tooYoung`} values={values} />
  ),
  email: <FormattedMessage id={`${PREFIX}.email`} />,
  passwordConfirmation: (
    <FormattedMessage id={`${PREFIX}.passwordConfirmation`} />
  ),
  'endDate.required': <FormattedMessage id={`${PREFIX}.endDate.required`} />,
  'endDate.isFuture': <FormattedMessage id={`${PREFIX}.endDate.isFuture`} />,
  monthlyAmount: <FormattedMessage id={`${PREFIX}.monthlyAmount`} />,
  passwordRequirements: (
    <FormattedMessage id={`${PREFIX}.passwordRequirements`} />
  ),
};
