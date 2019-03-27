import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toastActions } from '@catch/errors';

import { PlanConfirmView } from '../views';
import EnsureGoal from './EnsureGoal';
import SaveGoal from './SaveGoal';

export const ConfirmPlan = props => (
  <EnsureGoal goalName={props.goalName}>
    {ensureProps => (
      <SaveGoal goalName={props.goalName}>
        {saveProps => (
          <PlanConfirmView {...ensureProps} {...saveProps} {...props} />
        )}
      </SaveGoal>
    )}
  </EnsureGoal>
);

export default connect(undefined, toastActions)(ConfirmPlan);
