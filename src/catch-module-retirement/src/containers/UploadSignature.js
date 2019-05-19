import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

const Log = createLogger('upload-signature');

export const UPLOAD_SIGNATURE = gql`
  mutation UploadSignature($signature: String!) {
    uploadSignature(signature: $signature)
  }
`;

/**
 * uploadSignature uploads a user's signature to Folio for acknowledgement
 * Returns if the operation was successful, otherwise will error
 */

export const UploadSignature = ({ children, onCompleted, signature }) => (
  <Mutation mutation={UPLOAD_SIGNATURE} onCompleted={onCompleted}>
    {(mutate, { loading, error }) => {
      if (loading) Log.debug('uploading signature');

      return children({
        loading,
        error,
        uploadSignature: () => mutate({ variables: { signature } }),
      });
    }}
  </Mutation>
);

UploadSignature.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  signature: PropTypes.string,
};

export default UploadSignature;
