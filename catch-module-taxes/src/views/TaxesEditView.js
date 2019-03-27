import React from 'react';
import { connect } from 'react-redux';
import { formValueSelector, reset } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import { Box, Text, CenterFrame, Spinner, Divider } from '@catch/rio-ui-kit';
import { PlanEditLayout, PlanEstimatorView, ValidateGoal } from '@catch/common';
import {
  goTo,
  goBack,
  createLogger,
  Percentage,
  precisionRound,
} from '@catch/utils';
import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';

import { CalculateTaxes, UpdateTaxGoal } from '../containers';
import { DependentsForm } from '../forms';
import TaxesBreakdownView from './TaxesBreakdownView';
import TaxesContextView from './TaxesContextView';

const PREFIX = 'catch.module.taxes.TaxesEstimatorView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  'ResultCard.headerText': values => (
    <FormattedMessage id={`${PREFIX}.ResultCard.headerText`} values={values} />
  ),
  'ResultCard.infoText': values => (
    <FormattedMessage id={`${PREFIX}.ResultCard.infoText`} values={values} />
  ),
  editButton: <FormattedMessage id={`${PREFIX}.editButton`} />,
  resetButton: <FormattedMessage id={`${PREFIX}.resetButton`} />,
  recommendation: values => (
    <FormattedMessage id={`${PREFIX}.recommendation`} values={values} />
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

const Log = createLogger('taxes-edit-view');

export class TaxesEditView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
    this.state = {
      isEditing: false,
    };
  }
  toggleEdit = () => this.setState({ isEditing: !this.state.isEditing });
  toggleBreakdown = () => this.setState({ breakdown: !this.state.breakdown });
  handleReset = () => this.props.reset('manualAdjustment');
  handleBack = Platform.select({
    web: () => this.goTo('/plan/taxes/overview'),
    default: () => this.goBack(),
  });
  handleCompleted = data => {
    const rate = data.upsertTaxGoal.paycheckPercentage;
    this.props.popToast({
      type: 'success',
      title: COPY['toastTitle']({ goalName: 'Taxes' }),
      msg: COPY['toastMsg']({ value: <Percentage whole>{rate}</Percentage> }),
    });
    this.handleBack();
  };
  render() {
    const { manualAdjustment, numDependents } = this.props;
    return (
      <CalculateTaxes formValues={{ numDependents: this.props.numDependents }}>
        {({
          loading,
          error,
          results,
          currentPaycheckPercentage,
          reccPaycheckPercentage,
          reccMonthlyContribution,
          taxGoal,
          grossIncome,
          estimatedW2Income,
          estimated1099Income,
          workType,
          goalID,
        }) => {
          if (loading) {
            return (
              <CenterFrame>
                <Spinner large />
              </CenterFrame>
            );
          } else if (error) {
            return <ErrorMessage error={error} />;
          } else {
            Log.debug({ reccPaycheckPercentage, results });

            const percentage = this.state.isEditing
              ? manualAdjustment !== results.estimatedPaycheckPercentage
                ? manualAdjustment
                : results.roundedPaycheckPercentage
              : currentPaycheckPercentage;

            const canReset = manualAdjustment !== reccPaycheckPercentage;

            return (
              <UpdateTaxGoal onCompleted={this.handleCompleted}>
                {({ upsertTaxGoal }) => (
                  <PlanEditLayout
                    planTitle="Taxes"
                    planIcon="tax"
                    onSave={() =>
                      upsertTaxGoal({
                        variables: {
                          input: {
                            paycheckPercentage:
                              manualAdjustment !== reccPaycheckPercentage
                                ? precisionRound(manualAdjustment, 2)
                                : reccPaycheckPercentage,
                            estimatedPaycheckPercentage:
                              results.estimatedPaycheckPercentage,
                            numDependents: results.inputs.numDependents,
                            status: taxGoal ? taxGoal.status : 'DRAFT',
                            totalLiability: results.totalLiability,
                            ...results.calculations, // federalLiability, stateLiability etc
                          },
                        },
                      })
                    }
                    onCancel={this.handleBack}
                  >
                    <ValidateGoal id={goalID} percentage={percentage + 0.01}>
                      {({ validationError }) => (
                        <PlanEstimatorView
                          use1099Income
                          goalName="Tax"
                          initialValues={{
                            paycheckPercentage: currentPaycheckPercentage,
                          }}
                          loading={loading}
                          isResetting={this.state.isResetting}
                          resetRecommendationValue={reccPaycheckPercentage}
                          title={COPY['title']}
                          subtitle={COPY['subtitle']}
                          percent={
                            this.state.isEditing
                              ? manualAdjustment !==
                                results.roundedPaycheckPercentage
                                ? manualAdjustment
                                : results.roundedPaycheckPercentage
                              : currentPaycheckPercentage
                          }
                          monthlyPayment={
                            manualAdjustment
                              ? (manualAdjustment * estimated1099Income) / 12
                              : reccMonthlyContribution
                          }
                          isEditing={this.state.isEditing}
                          adjustmentError={false}
                          resultHeader={COPY['ResultCard.headerText']({
                            estimatedPaycheckPercentage: (
                              <Percentage whole>
                                {results.roundedPaycheckPercentage}
                              </Percentage>
                            ),
                          })}
                          infoComponent={<TaxesBreakdownView />}
                          formComponent={
                            <React.Fragment>
                              <DependentsForm
                                initialValues={{
                                  numDependents:
                                    results.inputs.numDependents || 0,
                                }}
                              />
                              <Divider />
                              <TaxesContextView />
                            </React.Fragment>
                          }
                          resultComponent={
                            <Box my={3}>
                              <Text color="ash">
                                {COPY['recommendation']({
                                  percent: (
                                    <Text weight="medium" color="ash">
                                      <Percentage whole>
                                        {reccPaycheckPercentage}
                                      </Percentage>
                                    </Text>
                                  ),
                                })}
                              </Text>

                              <Box mt={1}>
                                {!this.state.isEditing ? (
                                  <Text
                                    color="link"
                                    weight="medium"
                                    onClick={this.toggleEdit}
                                  >
                                    {COPY['editButton']}
                                  </Text>
                                ) : (
                                  <Text
                                    color={canReset ? 'link' : 'wave--light2'}
                                    weight="medium"
                                    onClick={
                                      canReset ? this.handleReset : undefined
                                    }
                                  >
                                    {COPY['resetButton']}
                                  </Text>
                                )}
                              </Box>
                            </Box>
                          }
                          estimatedIncome={grossIncome}
                          estimatedW2Income={estimatedW2Income}
                          estimated1099Income={estimated1099Income}
                          workType={workType}
                        />
                      )}
                    </ValidateGoal>
                  </PlanEditLayout>
                )}
              </UpdateTaxGoal>
            );
          }
        }}
      </CalculateTaxes>
    );
  }
}

const withFormValues = connect(
  state => ({
    numDependents: formValueSelector('TaxGoal')(state, 'numDependents'),
    manualAdjustment: formValueSelector('manualAdjustment')(
      state,
      'paycheckPercentage',
    ),
  }),
  { reset, popToast: toastActions.popToast },
);

export default withFormValues(TaxesEditView);
