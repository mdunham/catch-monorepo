import React from 'react';
import { FormattedMessage } from 'react-intl';
import { View, Platform } from 'react-native';

import { withDimensions, Button, styles as st } from '@catch/rio-ui-kit';
import { goTo, goBack } from '@catch/utils';
import { FlowBar } from '@catch/common';

import { HealthExitStage } from '../containers';
import { Page } from '../components';

const PREFIX = 'catch.health.HealthExitView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: values => (
    <FormattedMessage
      id="catch.home.HealthExitCard.enrollNil.subtitle"
      values={values}
    />
  ),
  topAction: <FormattedMessage id={`${PREFIX}.topAction`} />,
  bottomAction: <FormattedMessage id={`${PREFIX}.bottomAction`} />,
};

// Taken from HealthExitCard
const origins = {
  STATE_EXCHANGE: (
    <FormattedMessage id="catch.home.HealthExitCard.origin.stateExchange" />
  ),
  MEDICARE: <FormattedMessage id="catch.home.HealthExitCard.origin.medicare" />,
  MEDICAID: <FormattedMessage id="catch.home.HealthExitCard.origin.medicaid" />,
  HEALTHCARE_GOV: (
    <FormattedMessage id="catch.home.HealthExitCard.origin.healthcareGov" />
  ),
};

export class HealthExitView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
  }
  handleContinue = stage => {
    switch (stage) {
      case 'STATE_EXCHANGE':
        this.goTo('/plan/health/support');
        break;
      case 'MEDICARE':
        this.goTo('/plan/health/dependents');
        break;
      case 'MEDICAID':
        this.goTo('/plan/health/income');
        break;
      case 'HEALTHCARE_GOV':
        this.goTo('/plan/health/plans');
        break;
      default:
        this.goTo('/plan/health/intro');
    }
  };
  handleExit = () => {
    this.goTo('/');
  };
  handleBack = () => {
    this.goBack();
  };
  render() {
    const { viewport } = this.props;
    return (
      <HealthExitStage>
        {({ exitStage }) => (
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
              title={COPY['title']}
              subtitle={
                exitStage
                  ? COPY['subtitle']({ origin: origins[exitStage] })
                  : undefined
              }
              centerTitle
              centerBody
              narrowTitle
              titleIcon="health"
              titleIconSize={64}
              titleIconStyle={{ opacity: 0.3 }}
              viewport={viewport}
              actionStack={viewport === 'PhoneOnly'}
              renderFooter={viewport === 'PhoneOnly'}
              actions={[
                {
                  onClick: this.handleExit,
                  children: COPY['topAction'],
                },
                {
                  onClick: () => this.handleContinue(exitStage),
                  type: 'outline',
                  children: COPY['bottomAction'],
                },
              ]}
            >
              {viewport !== 'PhoneOnly' && (
                <React.Fragment>
                  <View
                    style={st.get(['FullWidth', 'ButtonMax', 'BottomGutter'])}
                  >
                    <Button onClick={this.handleExit} viewport={viewport}>
                      {COPY['topAction']}
                    </Button>
                  </View>
                  <View style={st.get(['FullWidth', 'ButtonMax'])}>
                    <Button
                      onClick={() => this.handleContinue(exitStage)}
                      type="outline"
                      viewport={viewport}
                    >
                      {COPY['bottomAction']}
                    </Button>
                  </View>
                </React.Fragment>
              )}
            </Page>
          </React.Fragment>
        )}
      </HealthExitStage>
    );
  }
}

export default withDimensions(HealthExitView);
