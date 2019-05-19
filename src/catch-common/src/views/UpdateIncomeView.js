import React, { Component } from 'react';
import { func, number, bool } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';
import { UpdateIncome } from '../containers';
import { Label, UpdateModalLayout } from '../components';
import { UpdateIncomeForm } from '../forms';

const PREFIX = 'catch.util.views.UpdateIncomeView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  saveButton: <FormattedMessage id={`${PREFIX}.saveButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  descriptionLabel: <FormattedMessage id={`${PREFIX}.descriptionLabel`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export class UpdateIncomeView extends Component {
  static propTypes = {
    estimatedIncome: number.isRequired,
    formEstimatedIncome: number,
    toggleModal: func.isRequired,
    handleCancel: func.isRequired,
    hasPercentageChanged: bool,
    showUpdateTaxGoalView: func.isRequired,
  };

  constructPayload = () => {
    const { formEstimatedIncome } = this.props;
    return {
      input: { estimatedIncome: formEstimatedIncome },
    };
  };
  render() {
    const {
      estimatedIncome,
      toggleModal,
      showUpdateTaxGoalView,
      hasPercentageChanged,
    } = this.props;

    return (
      <UpdateIncome
        onCompleted={hasPercentageChanged ? showUpdateTaxGoalView : toggleModal}
      >
        {({ updateIncome }) => {
          return (
            <UpdateModalLayout
              title={COPY['title']}
              handleBack={toggleModal}
              handleNext={() =>
                updateIncome({ variables: this.constructPayload() })
              }
              nextButtonText={COPY['saveButton']}
              backButtonText={COPY['cancelButton']}
            >
              <UpdateIncomeForm initialValues={{ estimatedIncome }} />
              <Label>{COPY['descriptionLabel']}</Label>
              <Text color="subtle">{COPY['description']}</Text>
            </UpdateModalLayout>
          );
        }}
      </UpdateIncome>
    );
  }
}

const withFormEstimatedIncome = connect(state => ({
  formEstimatedIncome: formValueSelector('UpdateIncomeForm')(
    state,
    'estimatedIncome',
  ),
}));

const enhance = compose(withFormEstimatedIncome);

export default enhance(UpdateIncomeView);
