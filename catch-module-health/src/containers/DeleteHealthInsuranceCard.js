import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { HEALTH_INSURANCE } from './HealthInsurance';

const Log = createLogger('delete-health-insurance-card');

export const DELETE_HEALTH_INSURANCE_CARD = gql`
  mutation DeleteHealthInsuranceCard($sides: [InsuranceCardSide!]!) {
    deleteHealthInsuranceCard(sides: $sides)
  }
`;

const DeleteHealthInsuranceCard = ({ children, onCompleted }) => (
  <Mutation
    mutation={DELETE_HEALTH_INSURANCE_CARD}
    onCompleted={onCompleted}
    refetchQueries={[{ query: HEALTH_INSURANCE }]}
  >
    {(deleteHealthInsuranceCard, { loading, error }) => {
      if (loading) Log.debug('deleting health insurance card');

      return children({ deleteHealthInsuranceCard, loading });
    }}
  </Mutation>
);

DeleteHealthInsuranceCard.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default DeleteHealthInsuranceCard;
