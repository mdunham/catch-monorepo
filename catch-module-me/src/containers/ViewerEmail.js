import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { VIEWER_EMAIL } from '../store/endpoints';

/**
 * ViewerEmail is used to render the current email address in the
 * settings list. If the ChangeEmail flow is rendered in its own navigation
 * screen it will be use there as well.
 */
const ViewerEmail = ({ children }) => (
  <Query query={VIEWER_EMAIL}>
    {({ loading, error, data, refetch }) => {
      const email = access(data, 'viewer.user.email');

      return children({
        emailAddress: email,
        loading,
        error,
      });
    }}
  </Query>
);

ViewerEmail.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ViewerEmail;
