import React, { Component } from 'react';
import { func, number } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';

import { Box, Text } from '@catch/rio-ui-kit';
import { UpdateSpouseIncome } from '../containers';
import { Label, UpdateModalLayout } from '../components';
import { UpdateSpouseIncomeForm } from '../forms';

const PREFIX = 'catch.util.views.UpdateSpouseIncomeView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  saveButton: <FormattedMessage id={`${PREFIX}.saveButton`} />,
  cancelButton: <FormattedMessage id={`${PREFIX}.cancelButton`} />,
  descriptionLabel: <FormattedMessage id={`${PREFIX}.descriptionLabel`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
};

export class UpdateSpouseIncomeView extends Component {
  static propTypes = {
    spouseIncome: number.isRequired,
    formSpouseIncome: number,
    toggleModal: func.isRequired,
  };
  constructPayload = () => {
    const { formSpouseIncome } = this.props;
    return {
      input: { estimatedIncome: formSpouseIncome },
    };
  };
  render() {
    const {
      hasPercentageChanged,
      showUpdateTaxGoalView,
      spouseIncome,
      toggleModal,
    } = this.props;
    return (
      <UpdateSpouseIncome
        afterComplete={
          hasPercentageChanged ? showUpdateTaxGoalView : toggleModal
        }
      >
        {({ updateSpouseIncome }) => {
          return (
            <UpdateModalLayout
              title={COPY['title']}
              handleBack={toggleModal}
              handleNext={() =>
                updateSpouseIncome({ variables: this.constructPayload() })
              }
              nextButtonText={COPY['saveButton']}
              backButtonText={COPY['cancelButton']}
            >
              <UpdateSpouseIncomeForm initialValues={{ spouseIncome }} />
              <Label>{COPY['descriptionLabel']}</Label>
              <Text color="subtle">{COPY['description']}</Text>
            </UpdateModalLayout>
          );
        }}
      </UpdateSpouseIncome>
    );
  }
}

const withFormValue = connect(state => ({
  formSpouseIncome: formValueSelector('UpdateSpouseIncomeForm')(
    state,
    'spouseIncome',
  ),
}));

const enhance = compose(withFormValue);

export default enhance(UpdateSpouseIncomeView);
