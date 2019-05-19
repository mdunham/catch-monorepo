import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const UPLOAD_KYC_IMAGE = gql`
  mutation UploadIdentificationImage(
    $imageKey: String!
    $filetype: ImageFiletype!
  ) {
    uploadIdentificationImage(imageKey: $imageKey, filetype: $filetype) {
      accepted
    }
  }
`;

export const UploadKycImage = ({ children, onCompleted, onError }) => (
  <Mutation
    mutation={UPLOAD_KYC_IMAGE}
    onCompleted={onCompleted}
    onError={onError}
  >
    {(uploadKycImage, { loading, error }) => {
      return children({ uploadKycImage, loading, error });
    }}
  </Mutation>
);

UploadKycImage.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
};

export default UploadKycImage;
