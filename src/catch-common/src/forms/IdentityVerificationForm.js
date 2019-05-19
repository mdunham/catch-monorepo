import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, getFormValues } from 'redux-form';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { Dropdown, ReduxInput, SplitLayout, Box } from '@catch/rio-ui-kit';
import {
  createValidator,
  identityVerification,
  stateItems,
  identificationItems,
  formatDate,
} from '@catch/utils';

const PREFIX = 'catch.plans.IdentityVerificationForm';

export class IdentityVerificationForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    formValues: PropTypes.object,
  };
  render() {
    const { handleSubmit, intl: { formatMessage }, formValues } = this.props;
    return (
      <SplitLayout>
        <Box>
          <Field
            name="identificationType"
            qaName="identificationType"
            component={Dropdown}
            items={identificationItems}
            label={formatMessage({ id: `${PREFIX}.identificationType.label` })}
            white
          />
        </Box>
        <Box>
          <Field
            name="issuingCountry"
            qaName="issuingCountry"
            component={ReduxInput}
            label={formatMessage({ id: `${PREFIX}.issuingCountry.label` })}
            format={() =>
              formatMessage({ id: `${PREFIX}.issuingCountry.placeholder` })
            }
            disabled
            white
          />

          {!!formValues &&
            (formValues.identificationType === 'DRIVERS_LICENSE' ||
              formValues.identificationType === 'STATE_ID') && (
              <Field
                name="issuingState"
                qaName="issuingState"
                component={Dropdown}
                label={formatMessage({ id: `${PREFIX}.issuingState.label` })}
                items={stateItems}
                autocomplete
                white
              />
            )}

          <Field
            name="documentNumber"
            qaName="documentNumber"
            component={ReduxInput}
            label={formatMessage({ id: `${PREFIX}.documentNumber.label` })}
            white
          />

          <Field
            name="issuedDate"
            qaName="issuedDate"
            placeholder={formatMessage({
              id: `${PREFIX}.issuedDate.placeholder`,
            })}
            component={ReduxInput}
            format={formatDate}
            label={formatMessage({ id: `${PREFIX}.issuedDate.label` })}
            white
          />

          <Field
            name="expirationDate"
            qaName="expirationDate"
            placeholder={formatMessage({
              id: `${PREFIX}.expirationDate.placeholder`,
            })}
            format={formatDate}
            component={ReduxInput}
            label={formatMessage({ id: `${PREFIX}.expirationDate.label` })}
            white
          />
        </Box>
      </SplitLayout>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'IdentityVerificationForm',
  destroyOnUnmount: true,
  enableReinitialize: false,
  validate: createValidator(identityVerification),
});

const withFormValues = connect(state => ({
  formValues: getFormValues('IdentityVerificationForm')(state),
}));

const enhance = compose(injectIntl, withReduxForm, withFormValues);
export default enhance(IdentityVerificationForm);
