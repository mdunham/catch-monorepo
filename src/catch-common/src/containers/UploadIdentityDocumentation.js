import React from 'react';
import PropTypes from 'prop-types';
import { getFormValues } from 'redux-form';
import { connect } from 'react-redux';
import { toGQLDate, createLogger } from '@catch/utils';

import UploadIdentification from './UploadIdentification';
import { PlanVerifyIdentityView } from '../views';

const Log = createLogger('upload-identity-documentation');

export const UploadIdentityDocumentation = ({ formValues, ...props }) => (
  <UploadIdentification
    variables={{
      input: {
        issuingCountry: 'USA',
        issuingState: formValues ? formValues.issuingState : null,
        issuedDate: formValues ? toGQLDate(formValues.issuedDate) : null,
        expirationDate: formValues
          ? toGQLDate(formValues.expirationDate)
          : null,
        documentNumber: formValues ? formValues.documentNumber : null,
        identificationType: formValues ? formValues.identificationType : null,
      },
    }}
  >
    {({ uploadIdentification, loading }) => {
      return (
        <PlanVerifyIdentityView
          uploadIdentification={uploadIdentification}
          loading={loading}
          {...props}
        />
      );
    }}
  </UploadIdentification>
);

UploadIdentityDocumentation.propTypes = {
  formValues: PropTypes.object,
};

const withFormValues = connect(state => ({
  formValues: getFormValues('IdentityVerificationForm')(state),
}));

export default withFormValues(UploadIdentityDocumentation);
