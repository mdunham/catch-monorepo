import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

const FETCH_CHALLENGES = gql`
  query Challenges($id: ID!) {
    viewer {
      bankLink(id: $id) {
        bank {
          name
        }
        challenges {
          challengeId
          challengeType
          question
          choices {
            category
            possibleAnswer
          }
          image {
            imageUri
          }
          imageChoices {
            imageUri
          }
        }
      }
    }
  }
`;

const BankLinkChallenges = ({ children, bankLinkId }) => (
  <Query
    query={FETCH_CHALLENGES}
    variables={{ id: bankLinkId }}
    fetchPolicy="network-only"
  >
    {({ loading, error, data }) => {
      const bankName = access(data, 'viewer.bankLink.bank.name');
      const challenges = access(data, 'viewer.bankLink.challenges');
      return children({
        loading,
        error,
        bankName,
        challenges,
      });
    }}
  </Query>
);

export default BankLinkChallenges;
