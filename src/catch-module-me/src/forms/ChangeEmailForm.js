import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import { ReduxInput } from '@catch/rio-ui-kit';
import { createValidator, changeEmailValidation } from '@catch/utils';

const PREFIX = 'catch.module.me.ChangeEmailForm';

export class ChangeEmailForm extends React.Component {
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
        id="newEmail"
        name="email"
        component={ReduxInput}
        placeholder={label}
        type="text"
        label={label}
        onSubmit={handleSubmit}
        keyboardType="email-address"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
      />
    );
  }
}

const withReduxForm = reduxForm({
  form: 'ChangeEmailForm',
  validate: createValidator(changeEmailValidation),
  destroyOnUnmount: false,
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

export default enhance(ChangeEmailForm);
