import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { selectIncome } from './UserInfo';

export const CONTACTS_QUERY = gql`
  query ContactsQuery {
    viewer {
      user {
        id
        filingStatus
        workType
      }
      income {
        estimatedW2Income
        estimated1099Income
      }
      spouseIncome
      incomeState
      taxGoal {
        id
        numDependents
        taxDependents {
          id
          givenName
          familyName
          relation
        }
      }
      retirementGoal {
        id
        status
        trustedContact {
          id
          givenName
          familyName
          relation
        }
      }
      savingsAccountMetadata {
        isAccountReady
      }
      contacts {
        id
        givenName
        familyName
        relation
        phoneNumber
        email
        isTaxDependent
        isTrustedContact
      }
    }
  }
`;

export const ContactsQuery = ({ children }) => (
  <Query query={CONTACTS_QUERY} fetchPolicy="cache-and-network">
    {({ data, error, loading }) => {
      const filingStatus = access(data, 'viewer.user.filingStatus');
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const workType = access(data, 'viewer.user.workType');
      const spouseIncome = access(data, 'viewer.spouseIncome');
      const incomeState = access(data, 'viewer.incomeState');

      const estimatedIncome = selectIncome(
        { estimatedW2Income, estimated1099Income },
        workType,
      );

      const contacts = access(data, 'viewer.contacts');
      const numDependents = access(data, 'viewer.taxGoal.numDependents');
      const isAccountReady = access(
        data,
        'viewer.savingsAccountMetadata.isAccountReady',
      );
      const hasTaxGoal = !!access(data, 'viewer.taxGoal') && isAccountReady;

      const taxDependents =
        hasTaxGoal && access(data, 'viewer.taxGoal.taxDependents');
      const connectedDependents = taxDependents ? taxDependents.length : 0;

      const retirementGoal = access(data, 'viewer.retirementGoal');
      const hasRetirementGoal =
        retirementGoal && ['ACTIVE', 'PAUSED'].includes(retirementGoal.status);

      const hasTrustedContact =
        !!hasRetirementGoal &&
        !!access(data, 'viewer.retirementGoal.trustedContact.id');

      const trustedContactId = access(
        data,
        'viewer.retirementGoal.trustedContact.id',
      );

      const maxDependentsConnected =
        !!taxDependents && connectedDependents === taxDependents.length;

      return children({
        loading,
        error,
        numDependents,
        connectedDependents,
        hasRetirementGoal,
        hasTaxGoal,
        hasTrustedContact,
        trustedContactId,
        contacts,
        maxDependentsConnected,
        spouseIncome,
        estimatedIncome,
        filingStatus,
        incomeState,
      });
    }}
  </Query>
);

ContactsQuery.propTypes = {
  children: PropTypes.func.isRequired,
};

export default ContactsQuery;
