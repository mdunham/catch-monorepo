import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';
import { createLogger } from '@catch/utils';

import { RECOMMENDATIONS } from './Recommendations';

const Log = createLogger('set-interest');

export const SET_INTEREST = gql`
  mutation SetInterest($input: SetRecommendationIsInterestedInput!) {
    setRecommendationIsInterested(input: $input)
  }
`;

export function updateCache(id) {
  return (cache, { data: { setRecommendationIsInterested } }) => {
    const recQuery = cache.readQuery({
      query: RECOMMENDATIONS,
    });
    const recommendations = access(
      recQuery,
      'viewer.latestRecommendations.recommendations',
    );
    const targetIdx = recommendations.findIndex(rec => rec.id === id);
    if (targetIdx >= 0) {
      const updatedTarget = {
        ...recommendations[targetIdx],
        isInterested: true,
      };
      cache.writeQuery({
        query: RECOMMENDATIONS,
        data: {
          viewer: {
            ...recQuery.viewer,
            latestRecommendations: {
              ...recQuery.viewer.latestRecommendations,
              recommendations: recommendations.map(el => {
                if (el.id === recommendations[targetIdx].id) {
                  return updatedTarget;
                }
                return el;
              }),
            },
          },
        },
      });
    }
  };
}

const SetInterest = ({ children, onCompleted, id, isTest }) => (
  <Mutation
    mutation={SET_INTEREST}
    onCompleted={onCompleted}
    update={isTest ? undefined : updateCache(id)}
  >
    {(mutate, { loading }) => {
      if (loading) Log.debug('setting interest');
      return children({ setInterest: mutate, loading });
    }}
  </Mutation>
);

export default SetInterest;
