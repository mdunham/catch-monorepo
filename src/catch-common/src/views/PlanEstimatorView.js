import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';

import {
  Box,
  H1,
  H3,
  Text,
  Spinner,
  SplitLayout,
  withDimensions,
  CenterFrame,
  PageLayout,
} from '@catch/rio-ui-kit';
import { Percentage, Env } from '@catch/utils';
import { selectIncome } from '@catch/common';

import { AdjustableAnnualIncome } from '../containers';
import { ResultCard, SmallPageTitle } from '../components';

const PREFIX = 'catch.plans.EstimatorView';
export const COPY = {
  'ResultCard.percentLegend': (
    <FormattedMessage id={`${PREFIX}.ResultCard.percentLegend`} />
  ),
  // Keeping it here just for tests
  'ResultCard.description': ({ monthlyPayment, estimatedIncome, onClick }) => (
    <FormattedMessage
      id={`${PREFIX}.ResultCard.description`}
      values={{
        monthlyPayment: (
          <Text weight="medium">
            <FormattedNumber
              value={monthlyPayment || 0}
              currency="usd"
              style="currency"
            />
          </Text>
        ),
        annualIncome: (
          <Text color="link" weight="medium" onClick={onClick}>
            <FormattedNumber
              value={estimatedIncome}
              style="currency"
              currency="USD"
              minimumFractionDigits={0}
            />
          </Text>
        ),
      }}
    />
  ),
  'ResultCard.description.1099': ({
    monthlyPayment,
    estimatedIncome,
    onClick,
  }) => (
    <FormattedMessage
      id={`${PREFIX}.ResultCard.description.1099`}
      values={{
        monthlyPayment: (
          <Text weight="medium">
            <FormattedNumber
              value={monthlyPayment || 0}
              currency="usd"
              style="currency"
            />
          </Text>
        ),
        annualIncome: (
          <Text color="link" weight="medium" onClick={onClick}>
            <FormattedNumber
              value={estimatedIncome}
              style="currency"
              currency="USD"
              minimumFractionDigits={0}
            />
          </Text>
        ),
      }}
    />
  ),
  'ResultCard.adjustmentWarning': (
    <FormattedMessage id={`${PREFIX}.ResultCard.adjustmentWarning`} />
  ),
};

export class PlanEstimatorView extends React.Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool,
    formComponent: PropTypes.node,
    resultComponent: PropTypes.node,
    percent: PropTypes.number,
    monthlyPayment: PropTypes.number,
    numberOfDays: PropTypes.number,
  };

  static defaultProps = {
    layoutMode: 'default',
  };

  state = { isEditingIncome: false };

  componentDidUpdate() {
    if (!!this.props.isResetting) {
      const { change, resetRecommendationValue } = this.props;
      change('paycheckPercentage', resetRecommendationValue);
    }
  }

  toggleIncome = () => {
    this.setState({ isEditingIncome: !this.state.isEditingIncome });
  };

  render() {
    const {
      goalName,
      title,
      subtitle,
      loading,
      formComponent,
      percent,
      resultComponent,
      monthlyPayment,
      onAdjust,
      isEditing,
      resultHeader,
      infoComponent,
      infoText,
      adjustmentError,
      viewport,
      leftEstimator,
      headerOverride,
      rightComponent,
      layoutMode,
      cardStyles,
      workType,
      estimatedIncome,
      estimatedW2Income,
      estimated1099Income,
      use1099Income,
    } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    return loading ? (
      <CenterFrame>
        <Spinner large />
      </CenterFrame>
    ) : (
      <PageLayout viewport={viewport}>
        {headerOverride}
        <SplitLayout mode={layoutMode}>
          <Box>
            {!headerOverride && (
              <SmallPageTitle
                title={title}
                subtitle={subtitle}
                textProps={{ weight: 'medium' }}
                boxProps={{ mb: 4 }}
              />
            )}
            {formComponent}
            {leftEstimator && (
              <Field
                name="paycheckPercentage"
                baseStyleOverride={cardStyles}
                component={ResultCard}
                isEditing={isEditing}
                headerText={resultHeader}
                infoComponent={infoComponent}
                infoText={infoText}
                percent={percent}
                percentLegend={COPY['ResultCard.percentLegend']}
                description={COPY[
                  use1099Income && workType === 'WORK_TYPE_DIVERSIFIED'
                    ? 'ResultCard.description.1099'
                    : 'ResultCard.description'
                ]({
                  // Tax estimator should select 1099 income even if WORK_TYPE_DIVERSIFIED
                  estimatedIncome: selectIncome(
                    {
                      estimatedIncome,
                      estimatedW2Income,
                      estimated1099Income,
                    },
                    goalName === 'Tax' ? 'WORK_TYPE_1099' : workType,
                  ),
                  monthlyPayment,
                  onClick: this.toggleIncome,
                })}
                adjustmentError={
                  adjustmentError
                    ? COPY['ResultCard.adjustmentWarning']
                    : undefined
                }
              />
            )}
          </Box>
          {leftEstimator ? (
            rightComponent
          ) : (
            <Box mt={isMobile ? 1 : 170} mb={Env.isNative ? 4 : 0}>
              <Field
                name="paycheckPercentage"
                component={ResultCard}
                isEditing={isEditing}
                headerText={resultHeader}
                infoComponent={infoComponent}
                infoText={infoText}
                percent={percent}
                percentLegend={COPY['ResultCard.percentLegend']}
                description={COPY[
                  use1099Income && workType === 'WORK_TYPE_DIVERSIFIED'
                    ? 'ResultCard.description.1099'
                    : 'ResultCard.description'
                ]({
                  // Tax estimator should select 1099 income even if WORK_TYPE_DIVERSIFIED
                  estimatedIncome: selectIncome(
                    {
                      estimatedIncome,
                      estimatedW2Income,
                      estimated1099Income,
                    },
                    goalName === 'Tax' ? 'WORK_TYPE_1099' : workType,
                  ),
                  monthlyPayment,
                  onClick: this.toggleIncome,
                })}
                adjustmentError={
                  adjustmentError
                    ? COPY['ResultCard.adjustmentWarning']
                    : undefined
                }
              />
              {resultComponent}
            </Box>
          )}
        </SplitLayout>
        {this.state.isEditingIncome && (
          <AdjustableAnnualIncome
            estimated1099Income={estimated1099Income}
            estimatedW2Income={estimatedW2Income}
            workType={workType}
            onDismiss={this.toggleIncome}
          />
        )}
      </PageLayout>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'manualAdjustment',
  destroyOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
});

const enhance = compose(
  withDimensions,
  withReduxForm,
);

const Component = enhance(PlanEstimatorView);

Component.displayName = 'PlanEstimatorView';

export default Component;
