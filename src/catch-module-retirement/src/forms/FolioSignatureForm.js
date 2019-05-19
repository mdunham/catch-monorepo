import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, getFormValues, Field } from 'redux-form';

import { Box, Text, ReduxInput } from '@catch/rio-ui-kit';

export const FolioSignatureForm = ({ legalName }) => (
  <React.Fragment>
    <Field
      name="folioSignature"
      component={ReduxInput}
      confirmable={false}
      label="Enter your full legal name below to electronically sign:"
      grouped
      signature
    />

    <Text size="small" color="charcoal--light1">
      {legalName}
    </Text>
  </React.Fragment>
);

FolioSignatureForm.propTypes = {
  legalName: PropTypes.string.isRequired,
};

export default reduxForm({ form: 'folioSignatureForm' })(FolioSignatureForm);
