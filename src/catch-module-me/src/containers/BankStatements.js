import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const BANK_STATEMENTS = gql`
  query BankStatements {
    viewer {
      bankStatements {
        id
        date
      }
    }
  }
`;

export const BankStatements = ({ children }) => (
  <Query query={BANK_STATEMENTS} fetchPolicy="network-only">
    {({ loading, error, data }) => {
      const bankStatements = access(data, 'viewer.bankStatements');

      return children({ loading, error, bankStatements });
    }}
  </Query>
);

BankStatements.propTypes = {
  children: PropTypes.func.isRequired,
};

export default BankStatements;
