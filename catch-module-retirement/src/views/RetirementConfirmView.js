import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { PlanConfirmView } from '@catch/common';
import { goTo, navigationPropTypes, Env } from '@catch/utils';
import { Fine, Link } from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { RetirementFlow } from '../containers';

const PREFIX = 'catch.module.retirement.RetirementConfirmView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  planName: <FormattedMessage id={`${PREFIX}.planName`} />,
  disclosure: values => (
    <FormattedMessage id={`${PREFIX}.disclosure`} values={values} />
  ),
};

class RetirementConfirmView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  static defaultProps = {
    // Set the componentId manually for native navigation
    componentId: 'plan-flow',
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleEdit = () => {
    this.goTo('/plan/retirement/estimator');
  };
  handleConfirm = props => {
    if (Env.isNative) {
      if (props && props.showCatchUp) {
        this.goTo('/plan/catch-up', { goalType: 'RETIREMENT' });
      } else {
        this.goTo('/plan', {}, 'RESET');
      }
    } else {
      this.goTo('/plan', props, 'RESET');
    }
  };
  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementFlow>
          {({ loading, paycheckPercentage, status }) =>
            loading ? null : (
              <PlanConfirmView
                goalName="Retirement"
                planTitle={COPY['title']}
                planName={COPY['planName']}
                canFinish={true}
                onEdit={() => this.handleEdit()}
                onConfirm={() => this.goTo('/plan', {}, 'RESET')}
                onConfirm={this.handleConfirm}
                paycheckPercentage={paycheckPercentage}
                goalStatus={status}
                planDisclosures={COPY['disclosure']({
                  link: (
                    <Link to="http://s.catch.co/legal/ccm-adv2a.pdf" newTab>
                      ADV Part 2
                    </Link>
                  ),
                })}
              />
            )
          }
        </RetirementFlow>
      </ErrorBoundary>
    );
  }
}

export default RetirementConfirmView;
