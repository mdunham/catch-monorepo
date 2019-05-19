import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const HEALTH_EXIT_STAGE = gql`
  query HealthExitStage {
    viewer {
      health {
        information {
          exitStage
        }
      }
    }
  }
`;

const HealthExitStage = ({ children }) => (
  <Query query={HEALTH_EXIT_STAGE} fetchPolicy="network-only">
    {({ data, loading, error }) => {
      const get = access(data);
      const exitStage = get('viewer.health.information.exitStage');

      return children({
        exitStage,
        loading,
        error,
      });
    }}
  </Query>
);

HealthExitStage.propTypes = {
  children: PropTypes.func.isRequired,
};

export default HealthExitStage;
