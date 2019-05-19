import React from 'react';
import { func, object } from 'prop-types';
import { Query } from 'react-apollo';
import access from 'safe-access';
import gql from 'graphql-tag';

import { calculateTaxes as calculate, createLogger } from '@catch/utils';

const MONTHS_PER_YEAR = 12;

const Log = createLogger('calculating-taxes');

export const TAX_QUERY = gql`
  query TaxGoal {
    viewer {
      incomeState
      income {
        estimatedW2Income
        estimated1099Income
      }
      spouseIncome
      user {
        id
        filingStatus
        workType
      }
      taxGoal {
        id
        numDependents
        numExemptions
        taxDeferredContributions
        estimatedJobExpenseRange
        paycheckPercentage
        status
        availableBalance
      }
      savingsAccountMetadata {
        isAccountReady
        isAccountLocked
      }
    }
  }
`;

const CalculateTaxes = ({ children, formValues }) => (
  <Query query={TAX_QUERY} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      if (loading || error) return children({ loading, error });

      const grossIncome =
        access(data, 'viewer.income.estimatedW2Income') +
        access(data, 'viewer.income.estimated1099Income');
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const workType = access(data, 'viewer.user.workType');

      const incomeState = access(data, 'viewer.incomeState');
      const filingStatus = access(data, 'viewer.user.filingStatus');
      const spouseIncome = access(data, 'viewer.spouseIncome');
      const numDependents = access(data, 'viewer.taxGoal.numDependents');
      const numExemptions = access(data, 'viewer.taxGoal.numExemptions');
      const goalID = access(data, 'viewer.taxGoal.id');
      const taxGoal = access(data, 'viewer.taxGoal');
      const paycheckPercentage = access(
        data,
        'viewer.taxGoal.paycheckPercentage',
      );

      // for when a user doesnt have a tax goal yet
      const INITIAL_RESULTS = calculate({
        state: incomeState,
        filingStatus: filingStatus,
        grossIncome: grossIncome,
        spouseIncome: spouseIncome,
        numExemptions: 0,
        numDependents:
          formValues && formValues.numDependents > -1
            ? formValues.numDependents
            : 0,
      });

      if (!taxGoal) {
        return children({
          loading,
          error,
          results: INITIAL_RESULTS,
          currentFilingStatus: filingStatus,
          currentPaycheckPercentage: INITIAL_RESULTS.roundedPaycheckPercentage,
          currentMonthlyContribution:
            INITIAL_RESULTS.roundedPaycheckPercentage *
            (estimated1099Income / MONTHS_PER_YEAR),
          reccPaycheckPercentage: INITIAL_RESULTS.roundedPaycheckPercentage,
          reccMonthlyContribution:
            INITIAL_RESULTS.roundedPaycheckPercentage *
            (estimated1099Income / MONTHS_PER_YEAR),
          hasPercentageChanged: false,
          grossIncome: grossIncome,
          estimatedW2Income,
          estimated1099Income,
          workType,
        });
      }

      // These are the results returned if a user has a tax goal saved in our DB
      const results = calculate({
        state: incomeState,
        grossIncome:
          formValues && formValues.estimatedIncome
            ? parseFloat(formValues.estimatedIncome)
            : grossIncome,
        spouseIncome:
          formValues && formValues.spouseIncome
            ? parseFloat(formValues.spouseIncome)
            : spouseIncome,
        filingStatus:
          formValues && formValues.filingStatus
            ? formValues.filingStatus
            : filingStatus,
        numExemptions: numExemptions,
        numDependents:
          formValues && formValues.numDependents > -1
            ? formValues.numDependents
            : numDependents,
      });

      Log.info({ results });

      return children({
        loading,
        error,
        goalID: goalID,
        results: !!taxGoal ? results : INITIAL_RESULTS,
        currentFilingStatus: filingStatus,
        currentPaycheckPercentage: paycheckPercentage,
        currentMonthlyContribution:
          paycheckPercentage * (estimated1099Income / MONTHS_PER_YEAR),
        reccPaycheckPercentage: results.roundedPaycheckPercentage,
        reccMonthlyContribution:
          results.roundedPaycheckPercentage *
          (estimated1099Income / MONTHS_PER_YEAR),
        hasPercentageChanged:
          paycheckPercentage !== results.roundedPaycheckPercentage,
        taxGoal: taxGoal,
        grossIncome: grossIncome,
        estimatedW2Income,
        estimated1099Income,
        workType,
      });
    }}
  </Query>
);

CalculateTaxes.propTypes = {
  children: func.isRequired,
  formValues: object,
};

export default CalculateTaxes;
