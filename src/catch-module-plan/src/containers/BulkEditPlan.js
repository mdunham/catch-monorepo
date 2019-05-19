import React from 'react';
import { object } from 'prop-types';

import { Box, Text } from '@catch/rio-ui-kit';

import { EditPlanForm } from '../forms';

const BulkEditPlan = ({ formValues, goals, ptoCalculations }) => (
  <EditPlanForm
    goals={goals}
    formValues={formValues}
    ptoCalculations={goals.pto && ptoCalculations}
    initialValues={{
      taxPercentage: goals.tax && goals.tax.paycheckPercentage,
      retirementPercentage:
        goals.retirement && goals.retirement.paycheckPercentage,
      plannedTarget: goals.pto && goals.pto.plannedTarget,
      unplannedTarget: goals.pto && goals.pto.unplannedTarget,
    }}
  />
);

BulkEditPlan.propTypes = {
  formValues: object,
  goals: object.isRequired,
  ptoCalculations: object,
};

export default BulkEditPlan;
