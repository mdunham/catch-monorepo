import React from 'react';
import { FormattedMessage } from 'react-intl';
import { View, Text, Platform } from 'react-native';

import { withDimensions, styles as st, colors, Icon } from '@catch/rio-ui-kit';
import { PlanIntroView } from '@catch/common';
import { goTo } from '@catch/utils';
import { HealthPlanSelection } from '../containers';
import { HealthPlanMiniCard } from '../components';

const PREFIX = 'catch.health.HealthIntroView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  step1: <FormattedMessage id={`${PREFIX}.step1`} />,
  step2: <FormattedMessage id={`${PREFIX}.step2`} />,
  step3: <FormattedMessage id={`${PREFIX}.step3`} />,
  cta: <FormattedMessage id={`${PREFIX}.cta`} />,
  historyLabel: <FormattedMessage id={`${PREFIX}.historyLabel`} />,
};

export class HealthIntroView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleNext = () => {
    this.goTo(
      Platform.select({
        web: '/plan/health/support',
        default: '/plan/health',
      }),
    );
  };
  handlePlanDetails = planID => {
    if (Platform.OS === 'web') {
      this.goTo(`/plan/health/plans/${planID}`);
    } else {
      this.goTo('/plan/health/plans/details', { planID });
    }
  };
  render() {
    const { viewport } = this.props;
    return (
      <HealthPlanSelection>
        {({ loading, planID, metalLevel, planType, provider, planName }) => (
          <PlanIntroView
            hasBankLinked
            planName="health"
            title={COPY['title']}
            introText={COPY['subtitle']}
            step2Text={COPY['step1']}
            step3Text={COPY['step2']}
            step4Text={COPY['step3']}
            ctaText={COPY['cta']}
            onNext={this.handleNext}
          >
            {!loading &&
              planID && (
                <View
                  style={st.get(
                    ['CenterColumn', 'BottomSpace', 'Margins'],
                    viewport,
                  )}
                >
                  <View style={st.get(['Row', 'BottomGutter', 'XlTopGutter'])}>
                    <Icon
                      name="clock"
                      size={12}
                      fill={colors.ink}
                      dynamicRules={{ paths: { fill: colors.ink } }}
                    />
                    <Text
                      style={st.get(['H6', 'Medium', 'XsLeftGutter'], viewport)}
                    >
                      {COPY['historyLabel']}
                    </Text>
                  </View>
                  <HealthPlanMiniCard
                    viewport={viewport}
                    planType={planType}
                    provider={provider}
                    planName={planName}
                    metalLevel={metalLevel}
                    onPress={() => this.handlePlanDetails(planID)}
                  />
                </View>
              )}
          </PlanIntroView>
        )}
      </HealthPlanSelection>
    );
  }
}

export default withDimensions(HealthIntroView);
