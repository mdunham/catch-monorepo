// retirement

import React from 'react';

import { PlanUserNavigation } from '@catch/common';

import { RetirementEstimatorView } from '../views';
import { BASE_ROUTE, ROUTES } from '../const';

export const ConditionalNavigation = props => (
  <PlanUserNavigation isRetirement>
    {({ routes }) => {
      const routeConfig = {
        'identity-verification': {
          goToRoute: [BASE_ROUTE, ROUTES.identity],
          nextPath: [BASE_ROUTE, ROUTES.confirm],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        confirm: {
          goToRoute: [BASE_ROUTE, ROUTES.confirm],
          nextPath: '/plan',
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        agreement: {
          goToRoute: [BASE_ROUTE, ROUTES.agreement],
          nextPath: [BASE_ROUTE, ROUTES.investment],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        'investment-agreement': {
          goToRoute: [BASE_ROUTE, ROUTES.investment],
          nextPath: [BASE_ROUTE, ROUTES.confirm],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        legal: {
          goToRoute: [BASE_ROUTE, ROUTES.legal],
          nextPath: [BASE_ROUTE, ROUTES.agreement],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        regulatory: {
          goToRoute: [BASE_ROUTE, ROUTES.regulatory],
          nextPath: [BASE_ROUTE, ROUTES.agreement],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        ineligible: {
          goToRoute: [BASE_ROUTE, ROUTES.ineligible],
          nextPath: '/',
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
      };
      return (
        <RetirementEstimatorView sendTo={routeConfig[routes]} {...props} />
      );
    }}
  </PlanUserNavigation>
);
export default ConditionalNavigation;
