import React from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import { createLogger } from '@catch/utils';
import { SaveGoal } from '@catch/common';
import { formName } from '../const';
import { calculatePTOResults } from '../calc';
import TimeOffGoal from './TimeOffGoal';

const Log = createLogger('timeoff-estimator');

export class TimeoffEstimator extends React.PureComponent {
  render() {
    const { formValues, children, onCompleted } = this.props;
    let formTotal = 0;
    if (!!formValues) {
      const { unplannedTarget, plannedTarget } = formValues;
      formTotal = unplannedTarget + plannedTarget;
    }
    return (
      // Shouldn't need to refetch queries since TimeOffGoal is cache-and-network
      <TimeOffGoal>
        {({
          annualIncome,
          workType,
          estimatedW2Income,
          estimated1099Income,
          availableBalance,
          paycheckPercentage,
          plannedTarget,
          unplannedTarget,
          isAccountReady,
          totalTarget,
          status,
          goalID,
          loading,
          error,
        }) => {
          const results = calculatePTOResults({
            numberOfDays: formTotal || totalTarget,
            income: annualIncome || 0,
          });

          const initialValues = {
            unplannedTarget,
            plannedTarget,
          };

          const saveGoalInput = {
            status: status || 'DRAFT',
            paycheckPercentage: results.paycheckPercentage,
          };
          if (!!formValues) {
            saveGoalInput.unplannedTarget = formValues.unplannedTarget;
            saveGoalInput.plannedTarget = formValues.plannedTarget;
          }
          Log.debug(results);
          return (
            <SaveGoal
              goalName="PTO"
              onCompleted={onCompleted}
              variables={{
                // We pass the variables as such to avoid
                // assigning a new () => {} every time we rerender
                input: saveGoalInput,
              }}
            >
              {({ saveGoal, saving, saveError }) => {
                return children({
                  results,
                  initialValues,
                  onSave: saveGoal,
                  goalID,
                  availableBalance,
                  isAccountReady,
                  loading: saving || loading,
                  annualIncome,
                  workType,
                  estimatedW2Income,
                  estimated1099Income,
                  error,
                });
              }}
            </SaveGoal>
          );
        }}
      </TimeOffGoal>
    );
  }
}

export default connect(state => ({
  formValues: getFormValues(formName)(state),
}))(TimeoffEstimator);
