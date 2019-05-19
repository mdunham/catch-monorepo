import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const GET_BANK_STATEMENT = gql`
  query BankStatement($id: ID!) {
    viewer {
      bankStatementURL(id: $id)
    }
  }
`;

export const GetBankStatement = ({ children, id }) => (
  <Query
    query={GET_BANK_STATEMENT}
    variables={{ id }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      const bankStatementURL = access(data, 'viewer.bankStatementURL');

      return children({ loading, bankStatementURL });
    }}
  </Query>
);

GetBankStatement.propTypes = {
  children: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default GetBankStatement;
