import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const DOCTORS = gql`
  query Doctors {
    viewer {
      health {
        doctors {
          id
          name
          type
          phoneNumber
        }
      }
    }
  }
`;

const Doctors = ({ children }) => (
  <Query query={DOCTORS}>
    {({ data, loading, error }) => {
      const doctors = access(data, 'viewer.health.doctors');

      return children({ doctors, loading, error });
    }}
  </Query>
);

Doctors.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Doctors;
