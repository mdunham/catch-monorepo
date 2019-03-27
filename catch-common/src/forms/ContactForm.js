import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { View } from 'react-native';

import { createValidator, userContact } from '@catch/utils';
import { styles } from '@catch/rio-ui-kit';

import EmailField from './EmailField';
import PhoneNumberField from './PhoneNumberField';
import RelationshipField from './RelationshipField';
import LegalFirstNameField from './LegalFirstNameField';
import LegalLastNameField from './LegalLastNameField';

export const ContactForm = ({ breakpoints, formName, isTrustedContact }) => (
  <React.Fragment>
    <View
      style={breakpoints.select({
        'TabletLandscapeUp|TabletPortraitUp': styles.get([
          'CenterColumnRow',
          'Bilateral',
        ]),
      })}
    >
      <LegalFirstNameField form={formName} />
      <LegalLastNameField form={formName} />
    </View>
    <RelationshipField form={formName} />

    <React.Fragment>
      <EmailField form={formName} />
      <PhoneNumberField form={formName} />
    </React.Fragment>
  </React.Fragment>
);

ContactForm.propTypes = {
  formName: PropTypes.string,
  isTrustedContact: PropTypes.bool,
};

ContactForm.defaultProps = {
  formName: 'ContactForm',
};

const withReduxForm = reduxForm({
  form: 'ContactForm',
  validate: createValidator(userContact),
  enableReinitialize: true,
  destroyOnUnmount: false,
});

export default withReduxForm(ContactForm);
