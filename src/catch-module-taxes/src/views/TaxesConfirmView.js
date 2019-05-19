import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { PlanConfirmView, ReferralBonus } from '@catch/common';
import { goTo, navigationPropTypes, Env } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { Spinner } from '@catch/rio-ui-kit';

import { TaxGoal } from '../containers';

const PREFIX = 'catch.module.taxes.TaxesConfirmView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  planName: <FormattedMessage id={`${PREFIX}.planName`} />,
};

class TaxesConfirmView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  static defaultProps = {
    componentId: 'plan-flow',
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleConfirm = props => {
    if (Env.isNative) {
      if (props && props.showCatchUp) {
        this.goTo('/plan/catch-up', { goalType: 'TAX' });
      } else {
        this.goTo('/plan', {}, 'RESET');
      }
    } else {
      this.goTo('/plan', props, 'RESET');
    }
  };

  handleEdit = () => {
    this.goTo('/plan/taxes/estimator');
  };
  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TaxGoal>
          {({ loading, error, taxGoal }) => (
            <ReferralBonus>
              {({ hasRefBonus, bonusAmount }) => (
                <PlanConfirmView
                  goalName="Tax"
                  planTitle={COPY['title']}
                  planName={COPY['planName']}
                  canFinish={true}
                  hasRefBonus={hasRefBonus}
                  bonusAmount={bonusAmount}
                  onEdit={this.handleEdit}
                  onConfirm={this.handleConfirm}
                  paycheckPercentage={taxGoal ? taxGoal.paycheckPercentage : 0}
                  goalStatus={taxGoal && taxGoal.status}
                />
              )}
            </ReferralBonus>
          )}
        </TaxGoal>
      </ErrorBoundary>
    );
  }
}

export default TaxesConfirmView;
