import React from 'react';
import PropTypes from 'prop-types';
import { Text, Linking } from 'react-native';
import { connect } from 'react-redux';
import { isValid, getFormValues } from 'redux-form';

import { styles } from '@catch/rio-ui-kit';
import { AddContact, EditInfoLayout, LinkContact } from '@catch/common';

import { AddTaxDependentForm } from '../forms';

import { COPY } from './UpdateTaxDependentsView';

const handleInfo = () => {
  return Linking.openURL(
    'https://help.catch.co/setting-up-tax-withholding/who-qualifies-as-a-dependent',
  );
};

export const AddTaxDependentView = ({
  breakpoints,
  formValues,
  isValid,
  onCancel,
  onCompleted,
}) => (
  <LinkContact onCompleted={onCompleted}>
    {({ linkContact }) => (
      <AddContact
        onCompleted={data => {
          linkContact({
            variables: { id: data.addContact.id, type: 'TAX_DEPENDENT' },
          });
        }}
      >
        {({ addContact }) => (
          <EditInfoLayout
            title="Adding a tax dependent"
            description={
              <Text
                style={styles.get(
                  ['Body', 'BottomGutter'],
                  breakpoints.current,
                )}
              >
                {COPY['description']({
                  link: (
                    <Text
                      onPress={handleInfo}
                      style={styles.get('BodyLink', breakpoints.current)}
                    >
                      {COPY['link']}
                    </Text>
                  ),
                })}
              </Text>
            }
            breakpoints={breakpoints}
            actions={[
              {
                text: 'Cancel',
                onPress: onCancel,
              },
              {
                text: 'Create contact',
                disabled: !isValid,
                onPress: () =>
                  addContact({
                    variables: { contactDetails: formValues },
                  }),
              },
            ]}
          >
            <AddTaxDependentForm />
          </EditInfoLayout>
        )}
      </AddContact>
    )}
  </LinkContact>
);

AddTaxDependentView.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
};

const withFormState = connect(state => ({
  formValues: getFormValues('AddTaxDependentForm')(state),
  isValid: isValid('AddTaxDependentForm')(state),
}));

const Component = withFormState(AddTaxDependentView);
Component.displayName = 'AddTaxDependentView';

export default Component;
