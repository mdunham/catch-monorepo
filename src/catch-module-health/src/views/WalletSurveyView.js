import React from 'react';
import PropTypes from 'prop-types';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FormattedMessage } from 'react-intl';
import { View, Platform } from 'react-native';

import { withDimensions, Spinner, styles as st } from '@catch/rio-ui-kit';
import { goTo, insuranceSourcesCopy as INSURANCE_SOURCES } from '@catch/utils';

import { Page, HealthPlanMiniCard } from '../components';
import { HealthInsurance, UpsertHealthInsurance } from '../containers';
import { WalletSurveyForm } from '../forms';

const PREFIX = 'catch.health.WalletSurveyView';
const COPY = {
  defaultTitle: <FormattedMessage id={`${PREFIX}.defaultTitle`} />,
  enrollTitle: <FormattedMessage id={`${PREFIX}.enrollTitle`} />,
  enrollSubtitle: <FormattedMessage id={`${PREFIX}.enrollSubtitle`} />,
};

const planAnswers = {
  YES: <FormattedMessage id={`${PREFIX}.YES`} />,
  NO: <FormattedMessage id={`${PREFIX}.NO`} />,
  NOT_SURE: <FormattedMessage id={`${PREFIX}.NOT_SURE`} />,
};

export class WalletSurveyView extends React.PureComponent {
  static propTypes = {
    breakpoints: PropTypes.object,
    insuranceSource: PropTypes.string,
    viewport: PropTypes.string,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
  }
  handleBack = () => {
    this.goTo('/guide');
  };
  handleCompleted = () => {
    this.goTo('/plan/health/wallet/add');
  };
  handleFormChange = async (vals, planInfo, id, cb) => {
    const value = vals.insuranceSource;
    if (/^YES|^NO|^NOT_SURE/.test(value)) {
      if (value === 'YES') {
        cb({
          variables: {
            input: {
              id,
              insuranceSource: 'SELF_EXCHANGE',
              carrier: planInfo.issuer.name,
              planName: planInfo.name,
            },
          },
        });
      } else {
        cb({
          variables: {
            input: {
              id,
              insuranceSource: 'SELF_EXCHANGE',
            },
          },
        });
      }
    }
  };

  render() {
    const { breakpoints, insuranceSource: formValue, viewport } = this.props;

    return (
      <HealthInsurance>
        {({
          id,
          insuranceSource,
          providerPlan,
          didEnroll,
          dependents,
          loading: fetching,
        }) => (
          <UpsertHealthInsurance onCompleted={this.handleCompleted}>
            {({ upsertHealthInsurance, loading }) => (
              <Page
                actions={[
                  {
                    onClick: () =>
                      upsertHealthInsurance({
                        variables: {
                          input: { id, insuranceSource: formValue },
                        },
                      }),
                    children: 'Next',
                    disabled: !formValue || loading,
                  },
                ]}
                viewport={viewport}
                title={
                  fetching
                    ? undefined
                    : didEnroll
                      ? COPY['enrollTitle']
                      : COPY['defaultTitle']
                }
                subtitle={didEnroll && COPY['enrollSubtitle']}
                renderFooter={!didEnroll && !fetching}
                topNavLeftAction={this.handleBack}
                renderTopNav={Platform.OS === 'web' && 'scroll'}
                titleIcon="health"
                titleIconSize={66}
                narrowTitle
                centerTitle
                centerBody
              >
                {didEnroll &&
                  providerPlan && (
                    <HealthPlanMiniCard
                      viewport={viewport}
                      planType={providerPlan.type}
                      provider={providerPlan.issuer.name}
                      planName={providerPlan.name}
                      metalLevel={providerPlan.metalLevel}
                      dependents={dependents}
                    />
                  )}
                {fetching ? (
                  <View style={st.get(['CenterColumn', 'XlTopGutter'])}>
                    <Spinner large />
                  </View>
                ) : (
                  <WalletSurveyForm
                    initialValues={didEnroll ? undefined : { insuranceSource }}
                    options={didEnroll ? planAnswers : INSURANCE_SOURCES}
                    breakpoints={breakpoints}
                    viewport={viewport}
                    onChange={vals =>
                      this.handleFormChange(
                        vals,
                        providerPlan,
                        id,
                        upsertHealthInsurance,
                      )
                    }
                  />
                )}
              </Page>
            )}
          </UpsertHealthInsurance>
        )}
      </HealthInsurance>
    );
  }
}

const withFormValue = connect(state => ({
  insuranceSource: formValueSelector('WalletSurveyForm')(
    state,
    'insuranceSource',
  ),
}));

const enhance = compose(
  withFormValue,
  withDimensions,
);

const Component = enhance(WalletSurveyView);
Component.displayName = 'WalletSurveyView';

export default Component;
