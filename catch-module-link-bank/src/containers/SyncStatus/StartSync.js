import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('start-sync');

export const START_SYNC = gql`
  mutation StartSync($input: StartSyncRequest!) {
    startSync(input: $input) {
      id
      syncStatus
    }
  }
`;

const StartSync = ({ id, children, onCompleted, refetchQueries }) => (
  <Mutation
    mutation={START_SYNC}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
    variables={{ input: { bankLinkID: id } }}
  >
    {(startSync, { loading, error, data }) => {
      Log.debug(data);
      if (loading) Log.debug('Loading...');
      if (error) Log.debug(error);
      return children({
        startSync,
        loading,
        error,
        sync: access(data, 'startSync'),
      });
    }}
  </Mutation>
);

export default StartSync;
