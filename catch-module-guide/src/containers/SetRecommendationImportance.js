import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { RECOMMENDATIONS } from './Recommendations';

import { createLogger } from '@catch/utils';

const Log = createLogger('set-importance');

export const SET_IMPORTANCE = gql`
  mutation SetRecommendationImportance(
    $importanceInput: SetRecommendationImportanceInput!
  ) {
    setRecommendationImportance(input: $importanceInput)
  }
`;

// Find the rec object by id in the cache, update the importance
// and replace the recommendations with a fresh array
export function updateCache(id) {
  return (cache, { data: { setRecommendationImportance } }) => {
    try {
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
          importance: setRecommendationImportance,
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
    } catch (e) {
      Log.debug(e);
    }
  };
}

const SetRecommendationImportance = ({ children, onCompleted, id }) => (
  <Mutation
    mutation={SET_IMPORTANCE}
    onCompleted={onCompleted}
    update={updateCache(id)}
  >
    {(mutate, { loading }) => {
      if (loading) Log.debug('setting importance');
      return children({ setImportance: mutate, loading });
    }}
  </Mutation>
);

SetRecommendationImportance.propTypes = {
  children: PropTypes.func,
  onCompleted: PropTypes.func,
};

export default SetRecommendationImportance;
