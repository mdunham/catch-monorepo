import React from 'react';
import { func } from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

export const PORTFOLIOS_QUERY = gql`
  query Portfolios {
    portfolios {
      id
      name
      contents {
        name
        ticker
        weight
      }
    }
  }
`;

export const Portfolios = ({ children }) => (
  <Query query={PORTFOLIOS_QUERY}>
    {({ loading, error, data }) => {
      const portfolios = access(data, 'portfolios');

      let orderedPortfolios = [];
      const desiredOrder = ['Aggressive', 'Moderate', 'Conservative'];

      portfolios &&
        desiredOrder.forEach(portfolio => {
          const found = portfolios.find(p => p.name === portfolio);
          orderedPortfolios.push(found);
        });

      return children({ loading, error, portfolios: orderedPortfolios });
    }}
  </Query>
);

Portfolios.propTypes = {
  children: func.isRequired,
};

export default Portfolios;
