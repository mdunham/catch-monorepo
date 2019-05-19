import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { Platform } from 'react-native';

import { Dropdown, Input, ReduxInput, Box, Text } from '@catch/rio-ui-kit';
import {
  createValidator,
  legalAccount,
  stateItems,
  countryItems,
  formatPhone,
} from '@catch/utils';
import LegalAddressField from './LegalAddressField';

class LegalAddressForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    needed: PropTypes.array,
  };

  render() {
    const {
      handleSubmit,
      white,
      grouped,
      needed,
      pristine,
      isMobile,
    } = this.props;
    const showAlert = needed && needed.includes('KYC_ADDRESS') && !!pristine;

    return (
      <React.Fragment>
        <LegalAddressField
          alert={showAlert}
          form={formName}
          white={white}
          grouped={grouped}
          isMobile={isMobile}
        />
        {showAlert && (
          <Text color="fire" weight="medium" mt={-16}>
            Please review this info before proceeding
          </Text>
        )}
      </React.Fragment>
    );
  }
}

const formName = 'LegalAccountForm';

export default reduxForm({
  form: formName,
  destroyOnUnmount: true,
  enableReinitialize: false,
  validate: createValidator(legalAccount),
})(LegalAddressForm);
