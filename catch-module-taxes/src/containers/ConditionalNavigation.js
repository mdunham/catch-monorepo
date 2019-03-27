// taxes

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { PlanUserNavigation } from '@catch/common';

import { TaxesEstimatorView } from '../views';

import { BASE_ROUTE, ROUTES } from '../const';

// only estimator
export const ConditionalNavigation = props => (
  <PlanUserNavigation>
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
          nextPath: [BASE_ROUTE, ROUTES.confirm],
          prevPath: [BASE_ROUTE, ROUTES.estimator],
        },
        legal: {
          goToRoute: [BASE_ROUTE, ROUTES.legal],
          nextPath: [BASE_ROUTE, ROUTES.regulatory],
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
      return <TaxesEstimatorView sendTo={routeConfig[routes]} {...props} />;
    }}
  </PlanUserNavigation>
);

export default ConditionalNavigation;
