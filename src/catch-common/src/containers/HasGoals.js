import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

export const HAS_GOALS = gql`
  query HasGoals {
    viewer {
      taxGoal {
        id
      }
      retirementGoal {
        id
      }
      ptoGoal {
        id
      }
    }
  }
`;

const HasGoals = ({ children }) => (
  <Query query={HAS_GOALS}>
    {({ loading, error, data }) => {
      if (loading || error) return children({ loading, error });

      const hasGoals =
        !!data.viewer.taxGoal ||
        !!data.viewer.retirementGoal ||
        !!data.viewer.ptoGoal;
      return children({ hasGoals });
    }}
  </Query>
);

export default HasGoals;
