import React from 'react';

import { withDimensions } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

import { HouseholdPeopleForm } from '../forms';
import { HouseholdPeople, SaveHouseholdPeople } from '../containers';

export class HealthPeopleView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleSave = cb => {
    return async data => {
      const payload = {
        variables: {
          input: {
            totalPeopleHousehold: data.totalPeopleHousehold,
          },
        },
      };
      await cb(payload);
      this.goTo('/plan/health/estimate');
    };
  };
  render() {
    const { viewport } = this.props;
    return (
      <HouseholdPeople>
        {({ loading, peopleHouseholdNum }) => (
          <SaveHouseholdPeople>
            {({ loading, saveHouseholdPeople }) => (
              <HouseholdPeopleForm
                initialValues={{ totalPeopleHousehold: peopleHouseholdNum }}
                onSubmit={this.handleSave(saveHouseholdPeople)}
                viewport={viewport}
              />
            )}
          </SaveHouseholdPeople>
        )}
      </HouseholdPeople>
    );
  }
}

export default withDimensions(HealthPeopleView);
