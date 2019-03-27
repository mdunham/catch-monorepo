import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import { Platform } from 'react-native';

import { Box, Text, Divider, Spinner, CenterFrame } from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  Percentage,
  createLogger,
  precisionRound,
} from '@catch/utils';
import { FlowLayout, PlanEstimatorView, ValidateGoal } from '@catch/common';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { CalculateTaxes, UpdateTaxGoal } from '../containers';
import { DependentsForm } from '../forms';
import TaxesBreakdownView from './TaxesBreakdownView';
import TaxesContextView from './TaxesContextView';

const Log = createLogger('taxes-estimator-view');

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
};

export class EstimatorView extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    manualAdjustment: PropTypes.number,
    sendTo: PropTypes.object,
    ...navigationPropTypes,
  };
  state = {
    isEditing: false,
    isResetting: false,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  toggleEdit = () => this.setState({ isEditing: !this.state.isEditing });
  toggleBreakdown = () => this.setState({ breakdown: !this.state.breakdown });

  handleNextScreen = () => {
    const { sendTo } = this.props;

    this.goTo(sendTo.goToRoute, {
      nextPath: sendTo.nextPath,
      prevPath: sendTo.prevPath,
    });
  };

  // @NOTE: i know this is janky AF, but I have to trigger an event in a child component's componentDidUpdate
  // See PlanEstimatorView
  handleReset = async () => {
    await this.setState({ isResetting: true });
    this.setState({ isResetting: false });
  };

  render() {
    const { manualAdjustment } = this.props;

    // @TODO: break down HOCs into separate container
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <CalculateTaxes
          formValues={{ numDependents: this.props.numDependents }}
        >
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
                <UpdateTaxGoal onCompleted={this.handleNextScreen}>
                  {({ upsertTaxGoal }) => (
                    <FlowLayout
                      viewTitle={COPY['title']}
                      canClickNext={true}
                      onNext={() =>
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
                                <Text>
                                  {COPY['recommendation']({
                                    percent: (
                                      <Text weight="medium">
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
                                      color={canReset ? 'link' : 'ink'}
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
                    </FlowLayout>
                  )}
                </UpdateTaxGoal>
              );
            }
          }}
        </CalculateTaxes>
      </ErrorBoundary>
    );
  }
}

const withFormValues = connect(state => ({
  numDependents: formValueSelector('TaxGoal')(state, 'numDependents'),
  manualAdjustment: formValueSelector('manualAdjustment')(
    state,
    'paycheckPercentage',
  ),
}));

export default withFormValues(EstimatorView);
