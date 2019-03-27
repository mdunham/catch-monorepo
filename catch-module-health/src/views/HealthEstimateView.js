import React from 'react';
import { FormattedMessage } from 'react-intl';

import { withDimensions, Spinner } from '@catch/rio-ui-kit';
import { goTo } from '@catch/utils';

import {
  Page,
  PlanSavingsCard,
  CostSharingReductions,
  MedicaidMessage,
} from '../components';
import {
  EligibilityEstimate,
  SaveHealthDependents,
  ELIGIBILITY_ESTIMATE,
  SaveExitStage,
} from '../containers';

const PREFIX = 'catch.health.HealthEstimateView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  buttonText: <FormattedMessage id={`${PREFIX}.buttonText`} />,
};

export class HealthEstimateView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      isModalDismissed: false,
    };
  }
  handleExit = () => {
    this.goTo('/plan/health/exit');
  };
  handleContinue = () => {
    this.goTo('/plan/health/plans');
  };
  dismissModal = () => {
    this.setState({
      isModalDismissed: true,
    });
  };
  handleRemoveChildren = (cb, list) => {
    return async () => {
      const payload = {
        variables: {
          input: list
            .filter(
              dep => !(dep.relation === 'OTHER_DEPENDENT' && dep.age < 19),
            )
            .map(adult => ({
              age: Number(adult.age),
              relation: adult.relation,
              isSmoker: adult.isSmoker,
              isPregnant: adult.isPregnant,
              isParent: adult.isParent,
            })),
        },
        refetchQueries: [{ query: ELIGIBILITY_ESTIMATE }],
      };
      await cb(payload);
    };
  };
  render() {
    const { viewport } = this.props;
    const { isModalDismissed } = this.state;
    return (
      <SaveHealthDependents>
        {({ saveHealthDependents }) => (
          <EligibilityEstimate>
            {({
              loading,
              amount,
              reductions,
              medicaidStatus,
              numChildren,
              dependents,
            }) => {
              return (
                <Page
                  title={COPY['title']}
                  subtitle={COPY['subtitle']}
                  containTitle
                  centerTitle
                  centerBody
                  actions={[
                    {
                      onClick: this.handleContinue,
                      children: COPY['buttonText'],
                    },
                  ]}
                  viewport={viewport}
                >
                  {loading ? (
                    <Spinner large />
                  ) : (
                    <PlanSavingsCard amount={amount || 0} viewport={viewport} />
                  )}
                  {!!reductions && (
                    <CostSharingReductions viewport={viewport} />
                  )}
                  {!!medicaidStatus &&
                    !isModalDismissed && (
                      <SaveExitStage
                        stage="MEDICAID"
                        onCompleted={this.handleExit}
                      >
                        {({ saveExitStage }) => (
                          <MedicaidMessage
                            viewport={viewport}
                            onExit={saveExitStage}
                            status={medicaidStatus}
                            numChildren={numChildren}
                            onContinue={this.dismissModal}
                            onRemove={this.handleRemoveChildren(
                              saveHealthDependents,
                              dependents,
                            )}
                          />
                        )}
                      </SaveExitStage>
                    )}
                </Page>
              );
            }}
          </EligibilityEstimate>
        )}
      </SaveHealthDependents>
    );
  }
}

export default withDimensions(HealthEstimateView);
