import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { getFormValues } from 'redux-form';

import {
  Box,
  H3,
  Text,
  CenterFrame,
  Spinner,
  withDimensions,
} from '@catch/rio-ui-kit';
import {
  formatCurrency,
  goTo,
  goBack,
  navigationPropTypes,
  Env,
  Percentage,
} from '@catch/utils';
import {
  PlanEstimatorView,
  PlanEditLayout,
  ValidateGoal,
  FolioFooter,
} from '@catch/common';
import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';

import { ProjectedValueCard } from '../components';
import { RetirementFlow } from '../containers';

const formName = 'EditRetirementPercentageForm';

const PREFIX = 'catch.module.retirement.RetirementEstimatorView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  'result.title': <FormattedMessage id={`${PREFIX}.result.title`} />,
  'result.estimation': values => (
    <FormattedMessage id={`${PREFIX}.result.estimation`} values={values} />
  ),
  toastTitle: values => (
    <FormattedMessage
      id={`catch.toasts.EditContribution.title`}
      values={values}
    />
  ),
  toastMsg: values => (
    <FormattedMessage
      id={`catch.toasts.EditContribution.msg`}
      values={values}
    />
  ),
};

export class RetirementEditView extends React.PureComponent {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
  }
  handleBack = Platform.select({
    web: () => this.goTo('/plan/retirement/overview'),
    default: () => this.goBack(),
  });
  handleCompleted = data => {
    const rate = data.upsertRetirementGoal.paycheckPercentage;
    this.props.popToast({
      type: 'success',
      title: COPY['toastTitle']({ goalName: 'Retirement' }),
      msg: COPY['toastMsg']({ value: <Percentage whole>{rate}</Percentage> }),
    });
    this.handleBack();
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementFlow onCompleted={this.handleCompleted} type="EDITING">
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
            editPercentage,
            currentPaycheckPercentage,
          }) =>
            loading ? (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            ) : (
              <PlanEditLayout
                planTitle="Retirement"
                planIcon="retirement"
                onCancel={this.handleBack}
                onSave={onUpsert}
              >
                <View style={{ minHeight: size.window.height }}>
                  <ValidateGoal
                    id={id}
                    percentage={
                      (formValues
                        ? formValues.paycheckPercentage
                        : paycheckPercentage) + 0.01
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
                          paycheckPercentage: currentPaycheckPercentage,
                        }}
                        adjustmentError={validationError}
                        percent={editPercentage}
                        isEditing={true}
                        monthlyPayment={monthlyContribution}
                        rightComponent={
                          Env.isProd ? null : (
                            <ProjectedValueCard
                              totalSaved={totalSaved}
                              monthlyIncome={monthlyIncome}
                              retirementAge={retirementAge}
                            />
                          )
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
                <FolioFooter />
              </PlanEditLayout>
            )
          }
        </RetirementFlow>
      </ErrorBoundary>
    );
  }
}

const withFormValues = connect(state => ({
  formValues: getFormValues('manualAdjustment')(state),
}));

const withToasts = connect(
  null,
  { popToast: toastActions.popToast },
);

const enhance = compose(
  withDimensions,
  withToasts,
);

const Component = enhance(RetirementEditView);

Component.displayName = 'RetirementEditView';

export default Component;
