import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

export const TAX_DEPENDENTS = gql`
  query TaxDependents {
    viewer {
      taxGoal {
        id
        numDependents
        taxDependents {
          id
          givenName
          familyName
          relation
          isTaxDependent
        }
      }
    }
  }
`;

export const TaxDependents = ({ children }) => (
  <Query query={TAX_DEPENDENTS} fetchPolicy="cache-and-network">
    {({ data, loading, error }) => {
      // the number of dependents on the tax goal
      const numDependents = access(data, 'viewer.taxGoal.numDependents');

      // the contacts who are designated as tax dependents
      const taxDependents = access(data, 'viewer.taxGoal.taxDependents');

      // the number of contacts who are designated as tax dependents
      const numTaxDependents = taxDependents ? taxDependents.length : 0;

      // the number of tax dependents that dont correspond to an existing contact
      const unaccountedTaxDependents = numDependents - numTaxDependents;

      // formatting the intitial values for the updatetaxdependentsform
      const initialValues =
        taxDependents &&
        taxDependents.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.isTaxDependent }),
          {},
        );

      return children({
        initialValues,
        numDependents,
        taxDependents,
        numTaxDependents,
        unaccountedTaxDependents,
        loading,
        error,
      });
    }}
  </Query>
);

export default TaxDependents;
