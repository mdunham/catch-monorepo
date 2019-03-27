import React from 'react';
import { FormattedMessage } from 'react-intl';

// CCM - CATCH CAPITAL MAANGEMENT
const PREFIX = 'ccm.portfolioRecommendation';

export const AGE_COPY = {
  LOW: values => <FormattedMessage id={`${PREFIX}.age.LOW`} values={values} />,
  MEDIUM: values => (
    <FormattedMessage id={`${PREFIX}.age.MEDIUM`} values={values} />
  ),
  HIGH: values => (
    <FormattedMessage id={`${PREFIX}.age.HIGH`} values={values} />
  ),
};

export function buildRecommendationCopy({ age, riskComfort, riskLevel }) {
  return (
    <FormattedMessage id={`${PREFIX}.${age}.${riskComfort}.${riskLevel}`} />
  );
}
