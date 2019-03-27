import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { createLogger } from '@catch/utils';
import { HOME_STATUS } from '@catch/home/src/containers/HomeStatus';

import { RECOMMENDATIONS } from './Recommendations';

const Log = createLogger('answer-checkup');

export const ANSWER_QUESTIONS = gql`
  mutation AnswerQuestions($answers: AnswerQuestionsInput!) {
    answerQuestions(input: $answers) {
      surveyID
    }
  }
`;

const homeStatusVars = {
  incomeAction: ['USER_PENDING', 'SKIPPED', 'APPROVED'],
  rewardStatus: 'INITIAL',
};

const AnswerCheckup = ({ children, onCompleted }) => (
  <Mutation
    mutation={ANSWER_QUESTIONS}
    onCompleted={onCompleted}
    // Make sure we refresh the RECOMMENDATIONS query with fresh results
    refetchQueries={[
      { query: RECOMMENDATIONS },
      { query: HOME_STATUS, variables: homeStatusVars },
    ]}
  >
    {(mutate, { loading }) => {
      if (loading) Log.debug('Answering');
      return children({ answerCheckup: mutate, loading });
    }}
  </Mutation>
);

AnswerCheckup.propTypes = {
  children: PropTypes.func,
  onCompleted: PropTypes.func,
};

export default AnswerCheckup;
