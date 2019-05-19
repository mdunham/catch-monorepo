import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, Field } from 'redux-form';

import { Dropdown } from '@catch/rio-ui-kit';

import { GOAL_ACCOUNTS } from '../utils/copy';

export const GoalTransferForm = ({ items }) => {
  return (
    <Field
      white
      qaName="targetGoal"
      name="targetGoal"
      items={items.map(item => ({
        value: item.id,
        label: GOAL_ACCOUNTS[item.goalName],
      }))}
      component={Dropdown}
      grouped
    />
  );
};

const withReduxForm = reduxForm({
  form: 'TransferFundsForm',
  enableReinitailize: true,
  destroyOnUnmount: false,
});

const Component = withReduxForm(GoalTransferForm);
Component.displayName = 'GoalTransferForm';

export default Component;
