import React from 'react';

import { withDimensions } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

import { HealthPlanDetailPage } from '../components';
import { HealthPlanDetails, SaveHealthPlan } from '../containers';

export class HealthPlanDetailView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleComleted = () => {
    this.goTo('/plan/health/enroll');
  };
  renderPlanDetailPage = props => {
    const { viewport, size, planID, onRef, onMobileBack } = this.props;
    return (
      <SaveHealthPlan planID={planID}>
        {({ saveHealthPlan }) => (
          <HealthPlanDetailPage
            onSubmit={this.handleComleted}
            onMobileBack={onMobileBack}
            onSave={saveHealthPlan}
            viewport={viewport}
            planID={planID}
            onRef={onRef}
            size={size}
            {...props}
          />
        )}
      </SaveHealthPlan>
    );
  };
  render() {
    const { planID, viewport, size } = this.props;
    return (
      <HealthPlanDetails planID={planID}>
        {this.renderPlanDetailPage}
      </HealthPlanDetails>
    );
  }
}

const Component = withDimensions(HealthPlanDetailView);

Component.displayName = 'HealthPlanDetailView';

export default Component;
