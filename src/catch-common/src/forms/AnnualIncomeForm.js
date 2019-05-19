import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { Flex, ReduxInput, Button } from '@catch/rio-ui-kit';
import {
  createValidator,
  annualIncome,
  formatCurrency,
  normalizeCurrency,
} from '@catch/utils';

class AnnualIncomeForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <Flex>
        <Field
          name="income"
          label="Estimated Annual Income"
          component={ReduxInput}
          placeholder="$ 0"
          format={formatCurrency}
          normalize={normalizeCurrency}
        />

        <Flex justify="flex-end">
          <Button type="submit" onClick={handleSubmit}>
            Update
          </Button>
        </Flex>
      </Flex>
    );
  }
}

export default reduxForm({
  form: 'AnnualIncomeForm',
  validate: createValidator(annualIncome),
})(AnnualIncomeForm);
