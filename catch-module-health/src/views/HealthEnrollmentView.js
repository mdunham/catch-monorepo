import React from 'react';
import { FormattedMessage } from 'react-intl';
import { View, Text, Platform, Linking } from 'react-native';

import {
  withDimensions,
  styles as st,
  Icon,
  Spinner,
  colors,
} from '@catch/rio-ui-kit';
import { goTo, goBack } from '@catch/utils';
import { FlowBar } from '@catch/common';

import {
  HealthPlanSelection,
  HealthPlanDetails,
  SaveExitStage,
} from '../containers';
import { Page, HealthPlanPreviewCard } from '../components';

const PREFIX = 'catch.health.HealthEnrollmentView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  futureTitle: <FormattedMessage id={`${PREFIX}.futureTitle`} />,
  futureDescription: <FormattedMessage id={`${PREFIX}.futureDescription`} />,
  enrollButton: <FormattedMessage id={`${PREFIX}.enrollButton`} />,
};

const newWindowIcon = {
  name: 'new-window',
  fill: '#fff',
  dynamicRules: { paths: { fill: '#fff' } },
  size: 11,
  style: { marginLeft: 8 },
};

function redirectUrl(id) {
  return `https://www.healthcare.gov/see-plans/#/plan/results/${id}/details`;
}

export class HealthEnrollmentView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
  }
  handleEnroll = async (planID, cb) => {
    if (Platform.OS !== 'web') {
      await Linking.openURL(redirectUrl(planID));
    }
    cb();
  };
  handleExit = () => {
    this.goTo('/plan/health/exit');
  };
  handleBack = () => {
    this.goBack();
  };
  renderSelection = ({
    loading,
    dependents,
    monthlySavings,
    planID,
    planName,
    provider,
    yearlyMoop,
    yearlyDeduct,
    metalLevel,
    monthlyPremium,
    planType,
  }) => {
    const { viewport } = this.props;
    return (
      <SaveExitStage stage="HEALTHCARE_GOV" onCompleted={this.handleExit}>
        {({ saveExitStage }) => (
          <React.Fragment>
            {Platform.OS !== 'web' && (
              <FlowBar
                step={1}
                icon="health"
                showProgress={false}
                title="Health Explorer"
                onBack={this.handleBack}
              />
            )}
            <Page
              centerBody
              narrowTitle
              containTitle
              viewport={viewport}
              title={COPY['title']}
              subtitle={COPY['subtitle']}
              actions={[
                {
                  children: COPY['enrollButton'],
                  onClick: () => this.handleEnroll(planID, saveExitStage),
                  disabled: loading || !planID,
                  href: redirectUrl(planID),
                  icon: newWindowIcon,
                },
              ]}
              titleContainerStyle={{ maxWidth: 327 }}
            >
              {loading ? (
                <View
                  style={st.get([
                    'LgTopSpace',
                    'XlTopGutter',
                    'XlBottomGutter',
                    'LgBottomSpace',
                  ])}
                >
                  <Spinner large />
                </View>
              ) : (
                <HealthPlanPreviewCard
                  standalone
                  type={planType}
                  viewport={viewport}
                  planName={planName}
                  premium={monthlyPremium}
                  provider={provider}
                  metalLevel={metalLevel}
                  outOfPocket={yearlyMoop}
                  deductible={yearlyDeduct}
                  dependents={dependents}
                />
              )}
              <View
                style={st.get([
                  'Row',
                  'CenterColumn',
                  'TopGutter',
                  'ContentMax',
                  'XlBottomGutter',
                ])}
              >
                <Icon name="health" size={46} />
                <View style={st.get(['ButtonMax', 'LeftGutter'])}>
                  <Text
                    style={st.get(['Body', 'Bold', 'SmBottomGutter'], viewport)}
                  >
                    {COPY['futureTitle']}
                  </Text>
                  <Text style={st.get('Body', viewport)}>
                    {COPY['futureDescription']}
                  </Text>
                </View>
              </View>
            </Page>
          </React.Fragment>
        )}
      </SaveExitStage>
    );
  };
  render() {
    const { viewport } = this.props;
    return <HealthPlanSelection>{this.renderSelection}</HealthPlanSelection>;
  }
}

export default withDimensions(HealthEnrollmentView);
