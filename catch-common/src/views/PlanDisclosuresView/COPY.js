import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.plans.PlanDisclosuresView';

export const COPY = {
  flowTitle: <FormattedMessage id={`${PREFIX}.flowTitle`} />,
  flowSubtitle: values => (
    <FormattedMessage id={`${PREFIX}.flowSubtitle`} values={values} />
  ),
  mainTitle: <FormattedMessage id={`${PREFIX}.mainTitle`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  'description.p1': <FormattedMessage id={`${PREFIX}.description.p1`} />,
  'description.p2': <FormattedMessage id={`${PREFIX}.description.p2`} />,
  caption: <FormattedMessage id={`${PREFIX}.caption`} />,
  checkBoxLabel1: <FormattedMessage id={`${PREFIX}.checkBoxLabel1`} />,
  checkBoxLink1: <FormattedMessage id={`${PREFIX}.checkBoxLink1`} />,
  checkBoxLabel2: <FormattedMessage id={`${PREFIX}.checkBoxLabel2`} />,
  checkBoxLink2: <FormattedMessage id={`${PREFIX}.checkBoxLink2`} />,
  heading1: <FormattedMessage id={`${PREFIX}.heading1`} />,
  p1: <FormattedMessage id={`${PREFIX}.p1`} />,
  pLink1: <FormattedMessage id={`${PREFIX}.pLink1`} />,
  heading2: <FormattedMessage id={`${PREFIX}.heading2`} />,
  p2_1: <FormattedMessage id={`${PREFIX}.p2_1`} />,
  p2_2: <FormattedMessage id={`${PREFIX}.p2_2`} />,
  heading3: <FormattedMessage id={`${PREFIX}.heading3`} />,
  p3: values => <FormattedMessage id={`${PREFIX}.p3`} values={values} />,
  pLink2: <FormattedMessage id={`${PREFIX}.pLink2`} />,
  agreementBullet1: <FormattedMessage id={`${PREFIX}.agreementBullet1`} />,
  agreementBullet2: <FormattedMessage id={`${PREFIX}.agreementBullet2`} />,
  agreementBullet3: <FormattedMessage id={`${PREFIX}.agreementBullet3`} />,
  heading4: <FormattedMessage id={`${PREFIX}.heading4`} />,
  documentLink1: <FormattedMessage id={`${PREFIX}.documentLink1`} />,
  documentLink2: <FormattedMessage id={`${PREFIX}.documentLink2`} />,
  documentLink3: <FormattedMessage id={`${PREFIX}.documentLink3`} />,
  documentLink4: <FormattedMessage id={`${PREFIX}.documentLink4`} />,
  heading5: <FormattedMessage id={`${PREFIX}.heading5`} />,
  certificationBullet1: (
    <FormattedMessage id={`${PREFIX}.certificationBullet1`} />
  ),
  certificationBullet2: (
    <FormattedMessage id={`${PREFIX}.certificationBullet2`} />
  ),
  certificationBullet3: values => (
    <FormattedMessage id={`${PREFIX}.certificationBullet3`} values={values} />
  ),
  pLink3: <FormattedMessage id={`${PREFIX}.pLink3`} />,
  p4: <FormattedMessage id={`${PREFIX}.p4`} />,
};
