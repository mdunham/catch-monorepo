import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.guide';

const planTypes = {
  PLANTYPE_PTO: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.title`} />,
    description: <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.description`} />,
    planDescription: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.planDescription`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_PTO.caption`} />,
  },
  PLANTYPE_TAX: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.planDescription`} />
    ),
    planDescription: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.planDescription`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_TAX.caption`} />,
  },
  PLANTYPE_RETIREMENT: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.planDescription`} />
    ),
    planDescription: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.planDescription`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_RETIREMENT.caption`} />,
  },
  PLANTYPE_HEALTH: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_HEALTH.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_HEALTH.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_HEALTH.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_HEALTH.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_HEALTH.caption`} />,
  },
  PLANTYPE_DENTAL: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_DENTAL.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_DENTAL.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_DENTAL.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_DENTAL.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_DENTAL.caption`} />,
  },
  PLANTYPE_VISION: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_VISION.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_VISION.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_VISION.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_VISION.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_VISION.caption`} />,
  },
  PLANTYPE_LIFE: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_LIFE.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_LIFE.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_LIFE.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_LIFE.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_LIFE.caption`} />,
  },
  PLANTYPE_DISABILITY: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_DISABILITY.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_DISABILITY.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_DISABILITY.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_DISABILITY.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_DISABILITY.caption`} />,
  },
  // Not currently used
  PLANTYPE_HSA: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_HSA.title`} />,
    description: <FormattedMessage id={`${PREFIX}.PLANTYPE_HSA.description`} />,
  },
  PLANTYPE_529_PLAN: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_529_PLAN.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_529_PLAN.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_529_PLAN.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_529_PLAN.p2`} />,
    caption: <FormattedMessage id={`${PREFIX}.PLANTYPE_529_PLAN.caption`} />,
  },
  PLANTYPE_PARENTAL_LEAVE: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_PARENTAL_LEAVE.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_PARENTAL_LEAVE.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_PARENTAL_LEAVE.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_PARENTAL_LEAVE.p2`} />,
    caption: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_PARENTAL_LEAVE.caption`} />
    ),
  },
  PLANTYPE_STUDENT_LOAN: {
    title: <FormattedMessage id={`${PREFIX}.PLANTYPE_STUDENT_LOAN.title`} />,
    description: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_STUDENT_LOAN.description`} />
    ),
    p1: <FormattedMessage id={`${PREFIX}.PLANTYPE_STUDENT_LOAN.p1`} />,
    p2: <FormattedMessage id={`${PREFIX}.PLANTYPE_STUDENT_LOAN.p2`} />,
    caption: (
      <FormattedMessage id={`${PREFIX}.PLANTYPE_STUDENT_LOAN.caption`} />
    ),
  },
};

// Calls to action to be reused across the guide
export const ctas = {
  default: <FormattedMessage id={`${PREFIX}.ctas.default`} />,
  interest: <FormattedMessage id={`${PREFIX}.ctas.interest`} />,
  learn: <FormattedMessage id={`${PREFIX}.ctas.learn`} />,
  healthExplorer: <FormattedMessage id={`${PREFIX}.ctas.healthExplorer`} />,
  healthWallet: <FormattedMessage id={`${PREFIX}.ctas.healthWallet`} />,
  details: <FormattedMessage id={`${PREFIX}.ctas.details`} />,
  walletDetails: <FormattedMessage id={`${PREFIX}.ctas.walletDetails`} />,
};

// alternative copy for the health guide card when a user marks it as covered
export const healthCovered = {
  caption: <FormattedMessage id={`${PREFIX}.healthCovered.caption`} />,
  description: <FormattedMessage id={`${PREFIX}.healthCovered.description`} />,
};

export default planTypes;
