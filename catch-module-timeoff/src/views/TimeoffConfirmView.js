import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { PlanConfirmView, ReferralBonus } from '@catch/common';
import { goTo, navigationPropTypes, Env } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { TimeOffGoal } from '../containers';

const PREFIX = 'catch.module.timeoff.TimeoffConfirmView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  planName: <FormattedMessage id={`${PREFIX}.planName`} />,
};

class TimeoffConfirmView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  static defaultProps = {
    // Pass the componentId in props for native navigation
    componentId: 'plan-flow',
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleConfirm = props => {
    if (Env.isNative) {
      if (props && props.showCatchUp) {
        this.goTo('/plan/catch-up', { goalType: 'PTO' });
      } else {
        this.goTo('/plan', {}, 'RESET');
      }
    } else {
      this.goTo('/plan', props, 'RESET');
    }
  };
  handleEdit = () => {
    this.goTo('/plan/timeoff/estimator');
  };
  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TimeOffGoal>
          {({ paycheckPercentage, status }) => (
            <ReferralBonus>
              {({ hasRefBonus, bonusAmount }) => (
                <PlanConfirmView
                  goalName="PTO"
                  planTitle={COPY['title']}
                  planName={COPY['planName']}
                  canFinish={true}
                  hasRefBonus={hasRefBonus}
                  bonusAmount={bonusAmount}
                  onEdit={this.handleEdit}
                  onConfirm={this.handleConfirm}
                  paycheckPercentage={paycheckPercentage}
                  goalStatus={status && status}
                />
              )}
            </ReferralBonus>
          )}
        </TimeOffGoal>
      </ErrorBoundary>
    );
  }
}

export default TimeoffConfirmView;
