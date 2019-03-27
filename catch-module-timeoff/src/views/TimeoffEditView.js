import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { PlanEstimatorView, PlanEditLayout, ValidateGoal } from '@catch/common';
import { goTo, goBack, navigationPropTypes, Percentage } from '@catch/utils';
import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';

import TimeOffEstimatorForm from '../forms/EstimatorForm';
import { TimeoffEstimator } from '../containers';

const PREFIX = 'catch.module.timeoff.TimeoffEstimatorView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  result: values => (
    <FormattedMessage id={`${PREFIX}.result`} values={values} />
  ),
  'ResultCard.headerText': values => (
    <FormattedMessage id={`${PREFIX}.ResultCard.headerText`} values={values} />
  ),
  'ResultCard.infoText': (
    <FormattedMessage id={`${PREFIX}.ResultCard.infoText`} />
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

export class TimeoffEditView extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    sendTo: PropTypes.object,
    ...navigationPropTypes,
  };

  state = {
    isEditing: false,
    breakdown: false,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
  }

  toggleEdit = () => this.setState({ isEditing: !this.state.isEditing });
  toggleBreakdown = () => this.setState({ breakdown: !this.state.breakdown });
  handleBack = Platform.select({
    web: () => this.goTo('/plan/timeoff/overview'),
    default: () => this.goBack(),
  });

  handleCompleted = data => {
    const rate = data.upsertPTOGoal.paycheckPercentage;
    this.props.popToast({
      type: 'success',
      title: COPY['toastTitle']({ goalName: 'Time Off' }),
      msg: COPY['toastMsg']({ value: <Percentage whole>{rate}</Percentage> }),
    });
    this.handleBack();
  };

  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TimeoffEstimator onCompleted={this.handleCompleted}>
          {({
            goalID,
            results,
            onSave,
            initialValues,
            loading,
            annualIncome,
            workType,
            estimatedW2Income,
            estimated1099Income,
          }) => (
            <PlanEditLayout
              planTitle="Time Off"
              planIcon="timeoff"
              onSave={onSave}
              onCancel={this.handleBack}
            >
              <ValidateGoal
                id={goalID}
                percentage={results.paycheckPercentage + 0.01}
              >
                {({ validationError }) => (
                  <PlanEstimatorView
                    loading={loading}
                    title={COPY['title']}
                    subtitle={COPY['subtitle']}
                    percent={results.paycheckPercentage}
                    monthlyPayment={results.monthlyPayment}
                    resultHeader={COPY['ResultCard.headerText']({
                      numberOfDays: results.numberOfDays,
                    })}
                    adjustmentError={validationError}
                    formComponent={
                      <TimeOffEstimatorForm
                        validationError={validationError}
                        initialValues={initialValues}
                        onSubmit={onSave}
                      />
                    }
                    workType={workType}
                    estimatedIncome={annualIncome}
                    estimatedW2Income={estimatedW2Income}
                    estimated1099Income={estimated1099Income}
                  />
                )}
              </ValidateGoal>
            </PlanEditLayout>
          )}
        </TimeoffEstimator>
      </ErrorBoundary>
    );
  }
}

export default connect(
  null,
  { popToast: toastActions.popToast },
)(TimeoffEditView);
