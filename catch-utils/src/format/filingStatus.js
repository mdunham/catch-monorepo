import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.util.format.filingStatuses';

export const filingStatusCopy = {
  SINGLE: <FormattedMessage id={`${PREFIX}.SINGLE`} />,
  MARRIED: <FormattedMessage id={`${PREFIX}.MARRIED`} />,
  MARRIED_SEPARATELY: <FormattedMessage id={`${PREFIX}.MARRIED_SEPARATELY`} />,
  HEAD: <FormattedMessage id={`${PREFIX}.HEAD`} />,
};

export const filingStatusesLowerCase = {
  SINGLE: <FormattedMessage id={`${PREFIX}.SINGLE.lowercase`} />,
  MARRIED: <FormattedMessage id={`${PREFIX}.MARRIED.lowercase`} />,
  MARRIED_SEPARATELY: (
    <FormattedMessage id={`${PREFIX}.MARRIED_SEPARATELY.lowercase`} />
  ),
  HEAD: <FormattedMessage id={`${PREFIX}.HEAD.lowercase`} />,
};
