import React, { Component } from 'react';
import { string } from 'prop-types';
import { reduxForm, Field, formValueSelector } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { Box, ReduxInput, Dropdown } from '@catch/rio-ui-kit';
import {
  createValidator,
  updateFilingStatusForm,
  filingStatusItems,
  formatCurrency,
  ensureZero,
  normalizeCurrency,
} from '@catch/utils';
import FilingStatusField from './FilingStatusField';
import UserIncomeField from './UserIncomeField';
import SpouseIncomeField from './SpouseIncomeField';

import { Label } from '../components';

const PREFIX = 'catch.util.forms.UpdateFilingStatusForm';
export const COPY = {
  filingStatusLabel: <FormattedMessage id={`${PREFIX}.filingStatusLabel`} />,
  spouseIncomeLabel: <FormattedMessage id={`${PREFIX}.spouseIncomeLabel`} />,
};

export class UpdateFilingStatusForm extends Component {
  static propTypes = {
    formFilingStatus: string.isRequired,
  };
  render() {
    const { formFilingStatus, showUserIncomeInput } = this.props;
    return (
      <Box>
        <FilingStatusField form={formName} />
        {showUserIncomeInput && <UserIncomeField form={formName} />}
        {formFilingStatus === 'MARRIED' && (
          <SpouseIncomeField form={formName} />
        )}
      </Box>
    );
  }
}

const formName = 'UpdateFilingStatusForm';

const selector = formValueSelector(formName);

const withFormValue = connect(state => ({
  formFilingStatus: selector(state, 'filingStatus'),
}));

const withReduxForm = reduxForm({
  form: 'UpdateFilingStatusForm',
  validate: createValidator(updateFilingStatusForm),
});

const enhance = compose(withReduxForm, withFormValue);

export default enhance(UpdateFilingStatusForm);
