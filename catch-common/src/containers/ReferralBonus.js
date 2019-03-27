import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const REFERRAL_BONUS = gql`
  query ReferralBonus($status: RewardStatus!) {
    viewer {
      ptoGoal {
        id
        status
      }
      pendingRewards(status: $status) {
        code
        amount
        description
      }
    }
  }
`;

export const ReferralBonus = ({ children }) => (
  <Query
    query={REFERRAL_BONUS}
    variables={{ status: 'INITIAL' }}
    fetchPolicy="cache-and-network"
  >
    {({ loading, error, data }) => {
      const ptoGoal = access(data, 'viewer.ptoGoal');
      const hasPTOGoal = !!ptoGoal && ptoGoal.status === 'ACTIVE';
      const pendingRewards = access(data, 'viewer.pendingRewards');
      const hasPendingRewards =
        Array.isArray(pendingRewards) && pendingRewards.length > 0;
      const bonusAmount = hasPendingRewards
        ? pendingRewards[0].amount
        : undefined;

      return children({
        hasRefBonus: !hasPTOGoal && hasPendingRewards,
        bonusAmount,
      });
    }}
  </Query>
);

ReferralBonus.propTypes = {
  children: PropTypes.func,
};

export default ReferralBonus;
