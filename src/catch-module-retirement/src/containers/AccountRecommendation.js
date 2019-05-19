import React from 'react';
import PropTypes from 'prop-types';

import { UserInfo } from '@catch/common';
import { calculateAccountType } from '@catch/utils';

import RetirementFlow from './RetirementFlow';

export const AccountRecommendation = ({ children }) => (
  <UserInfo>
    {({ loading, filingStatus, estimatedIncome, spouseIncome }) => {
      if (loading) return children({ loading });

      const totalIncome =
        filingStatus === 'MARRIED'
          ? estimatedIncome + spouseIncome
          : estimatedIncome;

      const recommendedAccountType = calculateAccountType({
        filingStatus,
        income: totalIncome,
      });

      return children({ loading, recommendedAccountType });
    }}
  </UserInfo>
);

export default AccountRecommendation;
