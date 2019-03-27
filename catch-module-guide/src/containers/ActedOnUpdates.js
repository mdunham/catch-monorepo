import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import access from 'safe-access';

import { RECOMMENDATIONS } from './Recommendations';

export const SET_IS_ACTED_ON = gql`
  mutation SetIsActedOn($input: SetRecommendationIsActedOnInput!) {
    setRecommendationIsActedOn(input: $input)
  }
`;

export function updateActedOnCache(id) {
  return (cache, { data: { setRecommendationIsActedOn } }) => {
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
        // There shouldn't be any case to set it to false
        // It is reset each time a user takes the survey
        isActedOn: true,
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

const ActedOnUpdates = ({ children, onCompleted }) => (
  <Mutation mutation={SET_IS_ACTED_ON} onCompleted={onCompleted}>
    {(mutate, { loading }) => {
      return children({ setIsActedOn: mutate, loading });
    }}
  </Mutation>
);

ActedOnUpdates.propTypes = {
  children: PropTypes.func,
  onCompleted: PropTypes.func,
};

export default ActedOnUpdates;
