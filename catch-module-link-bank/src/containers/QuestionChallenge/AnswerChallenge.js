import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const ANSWER_CHALLENGE = gql`
  mutation AnswerChallenge($answer: ChallengeAnswer!) {
    answerChallenge(input: $answer)
  }
`;

const AnswerChallenge = ({ children }) => (
  <Mutation mutation={ANSWER_CHALLENGE}>
    {(mutate, { loading, error }) =>
      children({
        loading,
        error,
        onAnswer: ({ challengeId, answer, bankLinkId }) =>
          mutate({
            variables: {
              answer: {
                bankLinkId,
                challengeId,
                answer,
              },
            },
          }),
      })
    }
  </Mutation>
);

export default AnswerChallenge;
