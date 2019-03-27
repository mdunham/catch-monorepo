import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

export const REFERRAL_CODE = gql`
  query ReferralCode {
    viewer {
      user {
        id
        referralCode
      }
    }
  }
`;

const ReferralCode = ({ children }) => (
  <Query query={REFERRAL_CODE}>
    {({ loading, error, data }) =>
      children({
        loading,
        error,
        refCode: access(data, 'viewer.user.referralCode'),
      })
    }
  </Query>
);

export default ReferralCode;
