import React from 'react';
import { View } from 'react-native';
import { reduxForm } from 'redux-form';

import { styles } from '@catch/rio-ui-kit';
import {
  LegalFirstNameField,
  LegalLastNameField,
  RelationshipField,
} from '@catch/common';
import { createValidator, addTaxDependent } from '@catch/utils';

const formName = 'AddTaxDependentForm';

export const AddTaxDependentForm = () => (
  <React.Fragment>
    <View style={styles.get('Bilateral')}>
      <LegalFirstNameField form={formName} />
      <LegalLastNameField form={formName} />
    </View>
    <RelationshipField form={formName} />
  </React.Fragment>
);

const withForm = reduxForm({
  form: formName,
  validate: createValidator(addTaxDependent),
});

const Component = withForm(AddTaxDependentForm);
Component.displayName = 'AddTaxDependentForm';

export default Component;
