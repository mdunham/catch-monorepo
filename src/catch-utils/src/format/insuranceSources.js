import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.util.format.insuranceSources';

export const insuranceSourcesCopy = {
  SPOUSE: <FormattedMessage id={`${PREFIX}.SPOUSE`} />,
  PARENT: <FormattedMessage id={`${PREFIX}.PARENT`} />,
  EMPLOYER: <FormattedMessage id={`${PREFIX}.EMPLOYER`} />,
  MEDICARE: <FormattedMessage id={`${PREFIX}.MEDICARE`} />,
  MEDICAID: <FormattedMessage id={`${PREFIX}.MEDICAID`} />,
  VETERANS: <FormattedMessage id={`${PREFIX}.VETERANS`} />,
  SELF_EXCHANGE: <FormattedMessage id={`${PREFIX}.SELF_EXCHANGE`} />,
  // SELF_PLATFORM: <FormattedMessage id={`${PREFIX}.SELF_PLATFORM`} />,
  OTHER: <FormattedMessage id={`${PREFIX}.OTHER`} />,
};

export const insuranceSourcesCopyUppercase = {
  SPOUSE: <FormattedMessage id={`${PREFIX}.SPOUSE.uppercase`} />,
  PARENT: <FormattedMessage id={`${PREFIX}.PARENT.uppercase`} />,
  EMPLOYER: <FormattedMessage id={`${PREFIX}.EMPLOYER.uppercase`} />,
  MEDICARE: <FormattedMessage id={`${PREFIX}.MEDICARE.uppercase`} />,
  MEDICAID: <FormattedMessage id={`${PREFIX}.MEDICAID.uppercase`} />,
  VETERANS: <FormattedMessage id={`${PREFIX}.VETERANS.uppercase`} />,
  SELF_EXCHANGE: <FormattedMessage id={`${PREFIX}.SELF_EXCHANGE.uppercase`} />,
  // SELF_PLATFORM: <FormattedMessage id={`${PREFIX}.SELF_PLATFORM.uppercase`} />,
  OTHER: <FormattedMessage id={`${PREFIX}.OTHER.uppercase`} />,
};
