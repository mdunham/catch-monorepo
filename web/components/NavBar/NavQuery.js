import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';
import { requiresIDV } from '@catch/utils';

export const NAV_QUERY = gql`
  query NavQuery {
    viewer {
      user {
        id
        givenName
        familyName
        kycSavings {
          needed
        }
      }
      documentUploads {
        provider
        type
      }
      primaryAccount {
        id
        bankLink {
          id
          syncStatus
        }
      }
    }
  }
`;

const NavQuery = ({ children, skip }) => (
  <Query query={NAV_QUERY} skip={skip}>
    {({ loading, error, data }) => {
      const workType = access(data, 'viewer.user.workType');
      const givenName = access(data, 'viewer.user.givenName');
      const familyName = access(data, 'viewer.user.familyName');

      const showMenu = !!givenName;
      const kycNeeded = access(data, 'viewer.user.kycSavings.needed');
      const documentUploads = access(data, 'viewer.documentUploads');

      const needsIDV = requiresIDV(kycNeeded, documentUploads);

      const syncStatus = access(
        data,
        'viewer.primaryAccount.bankLink.syncStatus',
      );
      const needsBankSync = syncStatus === 'LOGIN_ERROR';

      return children({
        loading,
        error,
        showMenu,
        needsIDV,
        needsBankSync,
        givenName,
        familyName,
      });
    }}
  </Query>
);

NavQuery.propTypes = {
  children: PropTypes.func.isRequired,
  skip: PropTypes.bool,
};

export default NavQuery;
