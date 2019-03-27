import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('saved-zipcode');

export const USER_ZIPCODE = gql`
  query UserZipcode {
    viewer {
      user {
        id
        legalAddress {
          zip
        }
      }
      health {
        information {
          zipcode
        }
      }
    }
  }
`;
/**
 * This query is strictly used for pre-filling the zipcode
 * form
 */
const UserZipcode = ({ children }) => (
  <Query query={USER_ZIPCODE} fetchPolicy="network-only">
    {({ loading, data }) => {
      const legalZip = access(data, 'viewer.user.legalAddress.zip');
      const savedZip = access(data, 'viewer.health.information.zipcode');

      return children({
        loading,
        savedZipcode: savedZip || legalZip,
      });
    }}
  </Query>
);

export default UserZipcode;
