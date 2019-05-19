import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { injectIntl } from 'react-intl';
import { compose } from 'redux';

import { Dropdown, Box, ReduxInput } from '@catch/rio-ui-kit';
import {
  createValidator,
  socialOccupation,
  occupationItems,
} from '@catch/utils';
import SSNField from './SSNField';
import DobField from './DobField';
import LegalFirstNameField from './LegalFirstNameField';
import LegalLastNameField from './LegalLastNameField';
import PhoneNumberField from './PhoneNumberField';

const PREFIX = 'catch.plans.SocialOccupationForm';

class SocialOccupationForm extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    resetSSN: PropTypes.bool.isRequired,
    needed: PropTypes.array,
  };

  static defaultProps = {
    resetSSN: false,
  };

  render() {
    const {
      handleSubmit,
      intl: { formatMessage },
      white,
      initialValues: { ssn },
      resetSSN,
      needed,
      pristine,
      viewport,
      isMobile,
    } = this.props;

    const showNameAlert = needed && needed.includes('KYC_NAME') && !!pristine;
    const showSSNAlert = needed && needed.includes('KYC_SSN') && !!pristine;
    const showDobAlert = needed && needed.includes('KYC_DOB') && !!pristine;

    return (
      <React.Fragment>
        <Box row={!isMobile}>
          <Box screen={viewport} w={[null, null, 1 / 2]} pr={[null, 1, 1]}>
            <LegalFirstNameField
              white={white}
              form={formName}
              alert={showNameAlert}
            />
          </Box>
          <Box screen={viewport} w={[null, null, 1 / 2]} pl={[null, 1, 1]}>
            <LegalLastNameField
              white={white}
              form={formName}
              alert={showNameAlert}
            />
          </Box>
        </Box>
        <Field
          id="occupation"
          name="occupation"
          component={Dropdown}
          items={occupationItems}
          placeholder={formatMessage({
            id: `${PREFIX}.occupation.placeholder`,
          })}
          label={formatMessage({ id: `${PREFIX}.occupation.label` })}
          value={this.props.initialValues.occupation}
          white={white}
        />
        <Box align="flex-start">
          <DobField white={white} form={formName} alert={showDobAlert} />
          <PhoneNumberField form={formName} white={white} />
        </Box>
      </React.Fragment>
    );
  }
}

const formName = 'SocialOccupationForm';

const withReduxForm = reduxForm({
  form: formName,
  destroyOnMount: false,
  enableReinitialize: true,
  validate: createValidator(socialOccupation),
});

const enhance = compose(
  injectIntl,
  withReduxForm,
);

export default enhance(SocialOccupationForm);
