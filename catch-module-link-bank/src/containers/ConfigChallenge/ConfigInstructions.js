import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

const FETCH_INSTRUCTIONS = gql`
  query ConfigInstructions($id: ID!) {
    viewer {
      bankLink(id: $id) {
        configInstructions
      }
    }
  }
`;

const ConfigInstructions = ({ bankLinkId, children }) => (
  <Query query={FETCH_INSTRUCTIONS} variables={{ id: bankLinkId }}>
    {({ loading, error, data }) => {
      const instructions = access(data, 'viewer.bankLink.configInstructions');
      return children({
        loading,
        error,
        instructions,
      });
    }}
  </Query>
);

ConfigInstructions.propTypes = {
  bankLinkId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default ConfigInstructions;
