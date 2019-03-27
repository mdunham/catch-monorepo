import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('counties-by-zipcode');

export const COUNTIES_ZIPCODE = gql`
  query CountiesByZipcode($zipcode: String!) {
    countiesByZipcode(zipcode: $zipcode) {
      fips
      name
      state
      zipcode
    }
  }
`;

const CountiesByZipcode = ({ children, zipcode, skip }) => (
  <Query
    query={COUNTIES_ZIPCODE}
    skip={!zipcode || skip}
    variables={{ zipcode }}
  >
    {({ loading, data }) => {
      const counties = access(data, 'countiesByZipcode') || [];
      const matchMultiple =
        typeof zipcode === 'string' &&
        zipcode.length === 5 &&
        counties.length > 1;
      Log.debug(counties);
      const countyName = access(data, 'countiesByZipcode[0].name');
      const stateName = access(data, 'countiesByZipcode[0].state');

      return children({
        counties,
        matchMultiple,
        countyName,
        stateName,
        loading,
      });
    }}
  </Query>
);

export default CountiesByZipcode;
