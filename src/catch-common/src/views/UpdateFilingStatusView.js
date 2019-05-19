import React, { Component } from 'react';
import { bool, func, string, object, number } from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { Box, H3, Text, Button } from '@catch/rio-ui-kit';
import { UpdateFilingStatusAndIncome } from '../containers';
import { UpdateFilingStatusForm } from '../forms';
import { Label, UpdateModalLayout } from '../components';

const PREFIX = 'catch.util.views.UpdateFilingStatusView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  saveButton: <FormattedMessage id={`${PREFIX}.saveButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  descriptionLabel: <FormattedMessage id={`${PREFIX}.descriptionLabel`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export class UpdateFilingStatusView extends Component {
  static propTypes = {
    filingStatus: string.isRequired,
    formValues: object,
    toggleModal: func.isRequired,
    spouseIncome: number,
    showUpdateTaxGoalView: func.isRequired,
    hasPercentageChanged: bool,
    showUserIncomeInput: bool,
    estimatedIncome: number.isRequired,
  };

  static defaultProps = {
    showUserIncomeInput: false,
  };

  constructPayload = () => {
    const { formValues } = this.props;
    return {
      filingStatusInput: formValues.filingStatus,
      userIncomeInput: {
        estimatedIncome: !!formValues.estimatedIncome
          ? formValues.estimatedIncome
          : this.props.estimatedIncome,
      },
      spouseIncomeInput: !!formValues.spouseIncome
        ? {
            estimatedIncome: formValues.spouseIncome,
          }
        : null,
    };
  };

  render() {
    const {
      filingStatus,
      hasPercentageChanged,
      toggleModal,
      showUpdateTaxGoalView,
      showUserIncomeInput,
      spouseIncome,
      estimatedIncome,
    } = this.props;

    return (
      <UpdateFilingStatusAndIncome
        afterComplete={
          hasPercentageChanged ? showUpdateTaxGoalView : toggleModal
        }
      >
        {({ updateFilingStatus }) => {
          return (
            <UpdateModalLayout
              title={COPY['title']}
              handleBack={toggleModal}
              handleNext={() =>
                updateFilingStatus({ variables: this.constructPayload() })
              }
              nextButtonText={COPY['saveButton']}
              backButtonText={COPY['cancelButton']}
            >
              <UpdateFilingStatusForm
                showUserIncomeInput={showUserIncomeInput}
                initialValues={{ estimatedIncome, filingStatus, spouseIncome }}
              />
              <Label>{COPY['descriptionLabel']}</Label>
              <Text color="subtle">{COPY['description']}</Text>
            </UpdateModalLayout>
          );
        }}
      </UpdateFilingStatusAndIncome>
    );
  }
}

const withFormValues = connect(state => ({
  formValues: getFormValues('UpdateFilingStatusForm')(state),
}));

const enhance = compose(withFormValues);

export default enhance(UpdateFilingStatusView);
