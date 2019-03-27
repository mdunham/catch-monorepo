import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Flex, P, Button } from '@catch/rio-ui-kit';
import { PlanEstimatorView, FlowLayout, ValidateGoal } from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

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
};

class EstimatorView extends Component {
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
  }

  toggleEdit = () => this.setState({ isEditing: !this.state.isEditing });
  toggleBreakdown = () => this.setState({ breakdown: !this.state.breakdown });

  nextScreen = async ({ save }) => {
    const { sendTo } = this.props;

    await save();

    this.goTo(sendTo.goToRoute, {
      nextPath: sendTo.nextPath,
      prevPath: sendTo.prevPath,
    });
  };

  render() {
    return (
      <ErrorBoundary Component={ErrorMessage}>
        <TimeoffEstimator>
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
            <FlowLayout
              canClickNext={!loading}
              onNext={() => this.nextScreen({ save: onSave })}
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
            </FlowLayout>
          )}
        </TimeoffEstimator>
      </ErrorBoundary>
    );
  }
}

export default EstimatorView;
