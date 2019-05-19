import React from 'react';
import PropTypes from 'prop-types';
import access from 'safe-access';

import { createLogger } from '@catch/utils';
import { CalculateTaxes } from '@catch/taxes';
import { selectIncome } from '@catch/common';

const Log = createLogger('user-info-triggers:');

/**
 * UserInfoTriggers hijacks its children's onCompleted method to
 * provide a next fieldName a user should be updating
 * It is some sort of very primitive recommendation engine ;)
 */

export function selectNextScreen({
  workType,
  estimatedW2Income,
  estimated1099Income,
  taxStatus,
  hasPercentageChanged,
  hasNoTaxGoal,
}) {
  let suggestion;
  // triggerContext is used to pass additional info as to what
  // helped make the decision or to pass data to the next view
  // to avoid querying the it again
  const triggerContext = {};
  switch (workType) {
    case 'WORK_TYPE_W2':
      // A change to W2 should only prompt for pausing the tax plan
      // if it's not already paused.
      if (taxStatus === 'ACTIVE') {
        suggestion = 'PauseTaxesView';
      }
      break;
    case 'WORK_TYPE_DIVERSIFIED':
      // The first option suggests to 'specialize' a user's workType
      // if they set one income type to 0
      // Otherwise it will continue to 1099 specific recommendations
      if (estimatedW2Income === 0 || estimated1099Income === 0) {
        suggestion = 'UpdateWorkTypeView';
        triggerContext.nullIncome =
          estimatedW2Income === 0 ? 'WORK_TYPE_W2' : 'WORK_TYPE_1099';
        break;
      }
    case 'WORK_TYPE_1099':
      // The changed percentage is calculated on the fly with form values
      if (hasPercentageChanged) {
        suggestion = 'AdjustTaxesView';
        break;
      }
      // Then we want to make sure their tax plan isn't paused
      if (taxStatus === 'PAUSED') {
        suggestion = 'UnpauseTaxesView';
        break;
      }
      if (hasNoTaxGoal) {
        suggestion = 'AddTaxesView';
        break;
      }
    default:
    // By default the nextFieldName will be undefined
  }
  return { suggestion, triggerContext };
}
/**
 * These are fields and their values we need to keep track of in order to
 * mention them in our toasts
 */
export function formatUpdatedFields({
  fieldName,
  updatedFields,
  values,
  workType,
}) {
  const field = {};
  switch (fieldName) {
    case 'AdjustTaxesView':
      field.name = fieldName;
      // Here the rate is passed from AdjustTaxesView
      field.values = values;
      break;
    case 'UserIncomeField':
      const estimatedW2Income = access(values, 'setIncome.estimatedW2Income');
      const estimated1099Income = access(
        values,
        'setIncome.estimated1099Income',
      );
      field.values = {
        estimatedIncome: selectIncome(
          {
            estimatedW2Income,
            estimated1099Income,
          },
          workType,
        ),
        workType,
      };
      // If there is already some updatedField it means
      //  we come from workType so we combine them together for the toast
      if (updatedFields) {
        field.name = 'WorkType&UserIncome';
      } else {
        field.name = 'UserIncomeField';
      }
      // In both cases we override the updatedFields
      return [field];
  }
  return Array.isArray(updatedFields) ? updatedFields.concat([field]) : [field];
}

const UserInfoTriggers = ({
  onCompleted,
  onClose,
  fieldName,
  workType,
  estimatedW2Income,
  estimated1099Income,
  triggerContext,
  children,
}) => {
  const isIncomeProvided =
    estimatedW2Income !== NaN && estimated1099Income !== NaN;
  /**
   * Based on each fieldName we can provide different hooks and wrap in any
   * data provider we might need in order to make a recommendation
   */
  switch (fieldName) {
    // After a user has adjusted their tax rate they might still need to unpause their plan
    case 'AdjustTaxesView':
    // After a user switched their workType they may want to adjust their tax plan
    case 'UpdateWorkTypeView':
    case 'UserIncomeField':
      return (
        <CalculateTaxes
          formValues={
            isIncomeProvided
              ? {
                  estimatedIncome: estimatedW2Income + estimated1099Income,
                }
              : undefined
          }
        >
          {({
            loading,
            error,
            currentPaycheckPercentage,
            reccPaycheckPercentage,
            hasPercentageChanged,
            taxGoal,
          }) => {
            const taxStatus = taxGoal ? taxGoal.status : null;
            const hasNoTaxGoal =
              !taxGoal || taxStatus === 'DRAFT' || taxStatus === 'NOT_STARTED';

            return React.cloneElement(children, {
              onCompleted: data => {
                // Sometimes we use a fresh new work type from the mutation callback
                const newWorkType = access(data, 'updateUser.workType');

                const nextScreen = selectNextScreen({
                  workType: newWorkType || workType,
                  estimatedW2Income,
                  estimated1099Income,
                  taxStatus,
                  hasPercentageChanged,
                  hasNoTaxGoal,
                });
                Log.debug(nextScreen);

                const updatedFields = formatUpdatedFields({
                  fieldName,
                  updatedFields: access(triggerContext, 'updatedFields'),
                  values: data,
                  workType,
                });

                Log.debug(updatedFields);

                if (nextScreen.suggestion) {
                  onClose({
                    fieldName: nextScreen.suggestion,
                    // the triggerContext should not be mutated, we always yield a new object
                    // same for its fields
                    triggerContext: Object.assign(
                      {},
                      nextScreen.triggerContext,
                      { updatedFields },
                    ),
                  });
                  // If there are no more suggestions we pop the toast
                } else {
                  onCompleted({
                    updatedFields,
                  });
                }
              },
            });
          }}
        </CalculateTaxes>
      );
    default:
      return React.cloneElement(children, {
        onCompleted: data => {
          // We need to pass the updatedFields here however views outside this switch
          // statement currently do not need to register their fields as updated
          // as they handle their own toasts independently (for now)
          onCompleted({
            updatedFields: access(triggerContext, 'updatedFields'),
          });
        },
      });
  }
};

export default UserInfoTriggers;
