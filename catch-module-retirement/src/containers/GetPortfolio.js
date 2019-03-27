import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const GET_PORTFOLIO = gql`
  query GetPortfolio($id: ID!) {
    portfolio(id: $id) {
      name
      contents {
        name
        ticker
        weight
      }
    }
  }
`;

export const GetPortfolio = ({ children, id }) => (
  <Query query={GET_PORTFOLIO} variables={{ id }}>
    {({ data, loading, error }) => {
      const name = access(data, 'portfolio.name');
      const contents = access(data, 'portfolio.contents');

      return children({ loading, error, name, contents });
    }}
  </Query>
);

export default GetPortfolio;
