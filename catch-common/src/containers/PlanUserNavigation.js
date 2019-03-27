import React from 'react';
import PropTypes from 'prop-types';

import {
  createLogger,
  getParentRoute,
  navigationPropTypes,
} from '@catch/utils';

import UserInfo from './UserInfo';

const Log = createLogger('plan-user-navigation');

export const ROUTES = {
  agreement: 'agreement',
  confirm: 'confirm',
  identity: 'identity-verification',
  ineligible: 'ineligible',
  investment: 'investment-agreement',
  legal: 'legal',
  regulatory: 'regulatory',
};

export const getRoutes = ({
  hasValidLegalAddress,
  hasSSN,
  hasEmployment,
  acknowledgedAccountDisclosures,
  isIneligible,
  needsIdv,
  needsRegulatory,
  isRetirement,
  hasUploadedRetirementSignature,
}) => {
  if (isIneligible) {
    return ROUTES.ineligible;
  } else if (!!needsIdv) {
    return ROUTES.identity;
  } else if (!hasValidLegalAddress || !hasSSN || !hasEmployment) {
    return ROUTES.legal;
  } else if (!!needsRegulatory) {
    return ROUTES.regulatory;
  } else if (!acknowledgedAccountDisclosures) {
    return ROUTES.agreement;
  } else if (isRetirement && !hasUploadedRetirementSignature) {
    return ROUTES.investment;
  } else {
    return ROUTES.confirm;
  }
};

export const PlanUserNavigation = ({ children, isRetirement }) => (
  <UserInfo>
    {({
      loading,
      error,
      hasValidLegalAddress,
      hasSSN,
      hasEmployment,
      acknowledgedAccountDisclosures,
      isIneligible,
      isNotRisky,
      needsIdv,
      needsRegulatory,
      hasUploadedRetirementSignature,
    }) => {
      if (loading) {
        return children({ loading, error });
      } else {
        return children({
          routes: getRoutes({
            isIneligible,
            hasValidLegalAddress,
            hasSSN,
            hasEmployment,
            acknowledgedAccountDisclosures,
            needsIdv,
            needsRegulatory,
            isNotRisky,
            isRetirement,
            hasUploadedRetirementSignature,
          }),
        });
      }
    }}
  </UserInfo>
);

PlanUserNavigation.propTypes = {
  children: PropTypes.func.isRequired,
  isRetirement: PropTypes.bool,
};

PlanUserNavigation.defaultProps = {
  isRetirement: false,
};

export default PlanUserNavigation;
