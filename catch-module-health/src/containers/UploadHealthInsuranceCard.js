import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('upload-health-insurance-card');

export const UPLOAD_HEALTH_INSURANCE_CARD = gql`
  mutation UploadHealthInsuranceCard($input: UploadHealthInsuranceCardInput!) {
    uploadHealthInsuranceCard(input: $input)
  }
`;

const UploadHealthInsuranceCard = ({ children, onCompleted }) => (
  <Mutation mutation={UPLOAD_HEALTH_INSURANCE_CARD} onCompleted={onCompleted}>
    {(uploadHealthInsuranceCard, { loading, error }) => {
      if (loading) Log.debug('uploading health insurance card');

      return children({ uploadHealthInsuranceCard, loading, error });
    }}
  </Mutation>
);

UploadHealthInsuranceCard.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UploadHealthInsuranceCard;
