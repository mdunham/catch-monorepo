import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';

const Log = createLogger('upload-identification');

export const UPLOAD_IDENTIFICATION = gql`
  mutation UploadIdentification($input: UploadIdentificationInput!) {
    uploadIdentification(input: $input) {
      status
      needed
    }
  }
`;

export const UploadIdentification = ({ children, onCompleted, variables }) => (
  <Mutation mutation={UPLOAD_IDENTIFICATION} onCompleted={onCompleted}>
    {(mutate, { loading, error }) => {
      if (loading) Log.debug('uploading identification document');

      return children({
        uploadIdentification: () => mutate({ variables }),
        loading,
      });
    }}
  </Mutation>
);

UploadIdentification.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UploadIdentification;
