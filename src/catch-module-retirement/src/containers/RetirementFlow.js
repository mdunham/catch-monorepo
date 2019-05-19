import React from 'react';
import { func, number, object, string } from 'prop-types';
import { getFormValues, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import access from 'safe-access';

import {
  createLogger,
  calculateInitialPercentage,
  calculateRetirementIncome,
} from '@catch/utils';

import RetirementGoal from './RetirementGoal';
import UpsertRetirementGoal from './UpsertRetirementGoal';

const Log = createLogger('retirement-flow');

const INTEREST_RATES = {
  Conservative: 0.06,
  Moderate: 0.07,
  Aggressive: 0.08,
};

export const RetirementFlow = ({
  children,
  editPercentage,
  formValues,
  onCompleted,
  type,
}) => (
  <RetirementGoal>
    {goalProps => (
      <UpsertRetirementGoal
        onCompleted={onCompleted}
        editPercentage={editPercentage}
        formValues={formValues}
        status={goalProps.status ? goalProps.status : 'DRAFT'}
        type={type}
      >
        {({ onUpsert: mutate, ...upsertProps }) => {
          // the recommended percentage
          const recommendedPercentage = calculateInitialPercentage({
            age: goalProps.age ? goalProps.age : 19,
          });

          // figure out if a user is in the creation flow or is editing percentage in one off scenario
          const adjustmentPercentage = {
            CREATING: formValues && formValues.paycheckPercentage,
            EDITING: editPercentage,
          };

          const paycheckPercentage =
            adjustmentPercentage[type] || recommendedPercentage;

          const monthlyContribution =
            paycheckPercentage * (goalProps.estimatedIncome / 12);

          const onUpsert = () =>
            mutate({
              status: goalProps.status ? goalProps.status : 'DRAFT',
              formValues,
            });

          const retirementAge = 65;

          const retirementCalculations =
            monthlyContribution &&
            calculateRetirementIncome({
              currentAge: goalProps.age,
              monthlyPayment: monthlyContribution,
              retirementAge,
              initialAmount: goalProps.externalSavings,
              interestRate: INTEREST_RATES[goalProps.portfolioName],
            });

          const monthlyIncome = access(retirementCalculations, 'monthlyIncome');
          const totalSaved = access(retirementCalculations, 'totalSaved');

          return children({
            ...goalProps,
            ...upsertProps,
            onUpsert,
            formValues,
            paycheckPercentage,
            monthlyContribution,
            recommendedPercentage,
            totalSaved,
            monthlyIncome,
            retirementAge,
            editPercentage,
          });
        }}
      </UpsertRetirementGoal>
    )}
  </RetirementGoal>
);

RetirementFlow.defaultProps = {
  type: 'CREATING',
};

RetirementFlow.propTypes = {
  children: func.isRequired,
  editPercentage: number,
  formValues: object,
  onCompleted: func,
  type: string,
};

const withFormValues = connect(state => ({
  formValues: getFormValues('CreateRetirementGoalForm')(state),
  editPercentage: formValueSelector('EditRetirementPercentageForm')(
    state,
    'paycheckPercentage',
  ),
}));

export default withFormValues(RetirementFlow);
