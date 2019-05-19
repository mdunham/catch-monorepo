import React from 'react';

import { withDimensions } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

import { HouseholdIncomeForm } from '../forms';
import { HouseholdIncome, SaveHouseholdIncome } from '../containers';

export class HealthIncomeView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleSave = cb => {
    return async ({ totalHouseholdIncome }) => {
      const payload = {
        variables: {
          input: {
            totalHouseholdIncome,
          },
        },
      };
      await cb(payload);
      this.goTo('/plan/health/people');
    };
  };
  render() {
    const { viewport } = this.props;
    return (
      <HouseholdIncome>
        {({ loading, householdIncome }) => (
          <SaveHouseholdIncome>
            {({ loading, saveHouseholdIncome }) => (
              <HouseholdIncomeForm
                initialValues={{
                  totalHouseholdIncome: householdIncome,
                }}
                onSubmit={this.handleSave(saveHouseholdIncome)}
                viewport={viewport}
              />
            )}
          </SaveHouseholdIncome>
        )}
      </HouseholdIncome>
    );
  }
}

export default withDimensions(HealthIncomeView);
