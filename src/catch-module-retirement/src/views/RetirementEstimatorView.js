import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  H3,
  Text,
  CenterFrame,
  Spinner,
  withDimensions,
} from '@catch/rio-ui-kit';
import { formatCurrency, goTo, navigationPropTypes, Env } from '@catch/utils';
import {
  PlanEstimatorView,
  FlowLayout,
  ValidateGoal,
  FolioFooter,
} from '@catch/common';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { ProjectedValueCard } from '../components';
import { RetirementFlow } from '../containers';
import { formName } from '../const';

const PREFIX = 'catch.module.retirement.RetirementEstimatorView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  'result.title': <FormattedMessage id={`${PREFIX}.result.title`} />,
  'result.estimation': values => (
    <FormattedMessage id={`${PREFIX}.result.estimation`} values={values} />
  ),
};

export class RetirementEstimatorView extends React.Component {
  static propTypes = {
    sendTo: PropTypes.object,
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handleBack = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/account']);
  };

  handleNext = async ({ onUpsert }) => {
    const { sendTo } = this.props;

    await onUpsert();

    this.goTo(sendTo.goToRoute, {
      nextPath: sendTo.nextPath,
      prevPath: sendTo.prevPath,
    });
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementFlow>
          {({
            loading,
            id,
            paycheckPercentage,
            formValues,
            onUpsert,
            monthlyContribution,
            recommendedPercentage,
            totalSaved,
            monthlyIncome,
            retirementAge,
            annualIncome,
            estimatedIncome,
            estimated1099Income,
            estimatedW2Income,
            workType,
            currentPaycheckPercentage,
          }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <FlowLayout
                footer={<FolioFooter />}
                canClickNext={true}
                onBack={() => this.handleBack({ onUpsert })}
                onNext={() => this.handleNext({ onUpsert })}
              >
                <View style={{ minHeight: size.window.height }}>
                  <ValidateGoal
                    id={id}
                    percentage={
                      (formValues
                        ? formValues.paycheckPercentage
                        : currentPaycheckPercentage) + 0.01
                    }
                  >
                    {({ validationError }) => (
                      <PlanEstimatorView
                        cardStyles={{ height: 268 }}
                        form={formName}
                        loading={loading}
                        title={COPY['title']}
                        headerOverride={
                          <Box mb={4} mt={isMobile ? 3 : 0}>
                            <H3 mb={2}>{COPY['title']}</H3>
                            <Text size="large">{COPY['subtitle']}</Text>
                          </Box>
                        }
                        initialValues={{
                          paycheckPercentage: currentPaycheckPercentage
                            ? currentPaycheckPercentage
                            : recommendedPercentage,
                        }}
                        adjustmentError={validationError}
                        percent={
                          formValues
                            ? formValues.paycheckPercentage
                            : paycheckPercentage
                        }
                        isEditing={true}
                        monthlyPayment={monthlyContribution}
                        rightComponent={
                          <ProjectedValueCard
                            totalSaved={totalSaved}
                            monthlyIncome={monthlyIncome}
                            retirementAge={retirementAge}
                            viewport={viewport}
                          />
                        }
                        estimatedIncome={estimatedIncome}
                        estimatedW2Income={estimatedW2Income}
                        estimated1099Income={estimated1099Income}
                        workType={workType}
                        // layoutMode="detail"
                        leftEstimator
                      />
                    )}
                  </ValidateGoal>
                </View>
              </FlowLayout>
            )
          }
        </RetirementFlow>
      </ErrorBoundary>
    );
  }
}

const Component = withDimensions(RetirementEstimatorView);

Component.displayName = 'RetirementEstimatorView';

export default Component;
