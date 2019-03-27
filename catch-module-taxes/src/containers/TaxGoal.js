import React from 'react';
import { func } from 'prop-types';
import { Query } from 'react-apollo';
import { createLogger } from '@catch/utils';
import access from 'safe-access';

import { TAX_QUERY } from '../store/endpoints';

const Log = createLogger('tax-goal');

const TaxGoal = ({ children }) => (
  <Query query={TAX_QUERY} fetchPolicy="cache-and-network">
    {({ loading, error, data, refetch }) => {
      const taxGoal = access(data, 'viewer.taxGoal');
      const goalID = access(data, 'viewer.taxGoal.id');

      const isAccountLocked = access(
        data,
        'viewer.savingsAccountMetadata.isAccountLocked',
      );
      const isAccountReady =
        !isAccountLocked &&
        access(data, 'viewer.savingsAccountMetadata.isAccountReady');

      return children({
        error,
        refetch,
        loading,
        taxGoal,
        goalID,
        isAccountReady,
      });
    }}
  </Query>
);

TaxGoal.propTypes = { children: func.isRequired };

export default TaxGoal;
