import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';

import { createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

const Log = createLogger('set-vertical-interests');

export const SET_HEALTH_INSURANCE_INTEREST = gql`
  mutation($input: Boolean!) {
    setHealthInsuranceInterest(input: $input) {
      verticalInterest {
        healthInsuranceInterest
      }
    }
  }
`;

// this mutation will most likely be used in the near future
export const SET_LIFE_INSURANCE_INTEREST = gql`
  mutation($input: Boolean!) {
    setLifeInsuranceInterest(input: $input) {
      verticalInterest {
        lifeInsuranceInterest
      }
    }
  }
`;

export const SET_RETIREMENT_INTEREST = gql`
  mutation($input: Boolean!) {
    setRetirementInterest(input: $input) {
      verticalInterest {
        retirementInterest
      }
    }
  }
`;

const MUTATIONS = {
  HEALTH_INSURANCE: SET_HEALTH_INSURANCE_INTEREST,
  LIFE_INSURANCE: SET_LIFE_INSURANCE_INTEREST,
  RETIREMENT: SET_RETIREMENT_INTEREST,
};

export const SetVerticalInterest = ({
  children,
  onCompleted,
  refetchQueries,
  vertical,
  update,
}) => (
  <Mutation
    mutation={MUTATIONS[vertical]}
    onCompleted={onCompleted}
    refetchQueries={refetchQueries}
    update={update}
  >
    {(setInterest, { loading, error }) => {
      if (loading) Log.debug('updating vertical interests');
      return children({ setInterest });
    }}
  </Mutation>
);

SetVerticalInterest.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
  refetchQueries: PropTypes.array,
  vertical: PropTypes.string.isRequired,
  update: PropTypes.func,
};

export default connect(undefined, toastActions)(SetVerticalInterest);
