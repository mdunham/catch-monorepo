import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm, formValueSelector } from 'redux-form';

import { createValidator, workInfoForm } from '@catch/utils';
import {
  WorkStateField,
  SpouseIncomeField,
  FilingStatusField,
  UserIncomeField,
  EmployerNameField,
} from '@catch/common';
import { Button, Box } from '@catch/rio-ui-kit';
import { ErrorMessage } from '@catch/errors';
import { Header } from '../components';

const PREFIX = 'catch.module.login.WorkForm';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  'unserved.p1': <FormattedMessage id={`${PREFIX}.unserved.p1`} />,
  'unserved.p2': <FormattedMessage id={`${PREFIX}.unserved.p2`} />,
};

const validate = createValidator(workInfoForm);

export class WorkInfoForm extends Component {
  static propTypes = {
    filingStatus: PropTypes.string,
    workType: PropTypes.string.isRequired,
  };

  /**
   * From a workType input this method outputs the
   * specific fields to render, common fields are already in
   * the render function
   */
  renderSpecField = () => {
    const { workType } = this.props;
    switch (workType) {
      case 'WORK_TYPE_1099':
        return (
          <UserIncomeField
            name="estimated1099Income"
            validate={validate}
            form={formName}
            hideTooltip
          />
        );
      case 'WORK_TYPE_W2':
        return (
          <React.Fragment>
            <EmployerNameField form={formName} />
            <UserIncomeField
              name="estimatedW2Income"
              validate={validate}
              form={formName}
              hideTooltip
            />
          </React.Fragment>
        );
      case 'WORK_TYPE_DIVERSIFIED':
        return (
          <React.Fragment>
            <EmployerNameField form={formName} />
            <UserIncomeField
              name="estimatedW2Income"
              labelType="W2"
              validate={validate}
              form={formName}
              hideTooltip
            />
            <UserIncomeField
              name="estimated1099Income"
              labelType="1099"
              validate={validate}
              form={formName}
              hideTooltip
            />
          </React.Fragment>
        );
      /**
       * If the workType is not provided something is pretty
       * wrong so we display an error message
       */
      default:
        return <ErrorMessage />;
    }
  };

  render() {
    const {
      filingStatus,
      workType,
      invalid,
      handleSubmit,
      viewport,
    } = this.props;

    const showSpouseIncome = filingStatus === 'MARRIED';

    return (
      <React.Fragment>
        <Header
          title={COPY['title']}
          subtitle={COPY['subtitle']}
          viewport={viewport}
        />
        <WorkStateField validate={validate} form={formName} hideTooltip />
        <FilingStatusField validate={validate} form={formName} />
        {this.renderSpecField()}
        {showSpouseIncome && (
          <SpouseIncomeField validate={validate} hideTooltip form={formName} />
        )}
        <Box row justify="flex-end" mt={1}>
          <Button
            disabled={invalid}
            onClick={handleSubmit}
            style={viewport === 'PhoneOnly' ? { width: '100%' } : undefined}
          >
            {COPY['submitButton']}
          </Button>
        </Box>
      </React.Fragment>
    );
  }
}

const formName = 'WorkInfoForm';

const selector = formValueSelector(formName);

const withFilingStatus = connect(state => ({
  filingStatus: selector(state, 'filingStatus'),
}));

const withReduxForm = reduxForm({
  form: formName,
  validate,
});

const enhance = compose(
  withReduxForm,
  withFilingStatus,
);

export default enhance(WorkInfoForm);
