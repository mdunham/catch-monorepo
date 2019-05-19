import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { Flex, ReduxInput, Button } from '@catch/rio-ui-kit';
import { createValidator, changeEmailValidation } from '@catch/utils';

const PREFIX = 'catch.module.me.ConfirmEmailForm';

export class ConfirmEmailForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    isChanging: PropTypes.bool.isRequired,
  };

  render() {
    const {
      handleSubmit,
      isChanging,
      intl: { formatMessage },
    } = this.props;

    const label = formatMessage({ id: `${PREFIX}.label` });
    return (
      <Field
        id="confirmationCode"
        name="code"
        component={ReduxInput}
        placeholder={label}
        type="text"
        label={label}
        onSubmit={handleSubmit}
        keyboardType="number-pad"
      />
    );
  }
}

const withReduxForm = reduxForm({
  form: 'ConfirmEmailForm',
  validate: createValidator(changeEmailValidation),
  destroyOnUnmount: false,
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

export default enhance(ConfirmEmailForm);
