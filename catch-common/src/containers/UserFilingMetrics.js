import React, { Component } from 'react';
import { object } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { ErrorMessage } from '@catch/errors';
import { Spinner, Box } from '@catch/rio-ui-kit';
import { Log } from '@catch/utils';

import { selectIncome } from './UserInfo';

export const FILING_STATUS_AND_INCOME = gql`
  query FilingStatusAndIncome {
    viewer {
      user {
        id
        workType
        filingStatus
      }
      income {
        estimated1099Income
        estimatedW2Income
      }
      spouseIncome
      taxGoal {
        id
        status
        paycheckPercentage
      }
      incomeState
    }
  }
`;

const UserFilingMetrics = ({ children }) => (
  <Query query={FILING_STATUS_AND_INCOME} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      if (error) Log.debug(error);

      const filingStatus = access(data, 'viewer.user.filingStatus');
      const spouseIncome = access(data, 'viewer.spouseIncome');
      const taxGoal = access(data, 'viewer.taxGoal');
      const incomeState = access(data, 'viewer.incomeState');
      const workType = access(data, 'viewer.user.workType');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');

      const estimatedIncome = selectIncome(
        {
          estimated1099Income,
          estimatedW2Income,
        },
        workType,
      );

      const householdIncome =
        filingStatus === 'MARRIED'
          ? estimatedIncome + spouseIncome
          : estimatedIncome;

      return children({
        loading,
        error,
        workType,
        filingStatus,
        estimatedIncome,
        estimatedW2Income,
        estimated1099Income,
        householdIncome,
        spouseIncome,
        incomeState,
        taxGoal,
        hasTaxGoal: !!taxGoal,
      });
    }}
  </Query>
);

export default UserFilingMetrics;
