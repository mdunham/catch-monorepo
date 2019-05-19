import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Component from './Component';

const LIST = gql`
  query ListSavingsGoals($status: Status!) {
    viewer {
      savingsGoals(status: $status) {
        id
        name
        paycheckPercentage
        monthlyAmount
      }
    }
  }
`;

const withGoals = graphql(LIST, {
  options: ({ status }) => ({
    variables: { status },
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ ownProps, data: { loading, error, viewer } }) => ({
    loading,
    error,
    goals: (viewer && viewer.savingsGoals) || [],
    ...ownProps,
  }),
});

export default withGoals(Component);
