import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('state-support');

export const CHECK_STATE_SUPPORT = gql`
  mutation CheckStateSupport(
    $input: IsStateSupportedInput!
    $info: HealthInformationInput!
  ) {
    isStateSupported(input: $input) {
      isSupported
      url
    }
    upsertHealthInformation(input: $info) {
      zipcode
      countyfips
      state
    }
  }
`;

const CheckStateSupport = ({ children, onCompleted, counties, countyIdx }) => (
  <Mutation
    mutation={CHECK_STATE_SUPPORT}
    onCompleted={onCompleted}
    variables={
      counties && counties[0]
        ? {
            input: {
              state: counties[countyIdx].state,
            },
            info: {
              zipcode: counties[countyIdx].zipcode,
              countyfips: counties[countyIdx].fips,
              state: counties[countyIdx].state,
            },
          }
        : undefined
    }
  >
    {(checkStateSupport, { loading, error, data }) => {
      if (loading) Log.debug('checking state support');

      const isStateSupported = access(data, 'isStateSupported.isSupported');
      const stateExchangeUrl = access(data, 'isStateSupported.url');

      return children({
        loading,
        checkStateSupport,
        isStateSupported,
        stateExchangeUrl,
      });
    }}
  </Mutation>
);

export default CheckStateSupport;
