import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import access from 'safe-access';

import { createLogger } from '@catch/utils';

const Log = createLogger('checkup-questions');

export const SURVEY_QUESTIONS = gql`
  query SurveyQuestion {
    viewer {
      user {
        id
        workType
        # For legacy users
        confidence {
          taxesConfidence
        }
      }
      taxGoal {
        id
        status
      }
      income {
        estimatedW2Income
        estimated1099Income
      }
      survey {
        id
        hasFinished
        questions {
          id
          text
          type
          workTypeVisibleTo
          dependsOnQuestionKey
          criteria
          possibleAnswers {
            id
            text
          }
        }
      }
    }
  }
`;

const CheckupQuestions = ({ children }) => (
  <Query query={SURVEY_QUESTIONS}>
    {({ loading, error, data }) => {
      const questions = access(data, 'viewer.survey.questions');
      const workType = access(data, 'viewer.user.workType');
      const surveyID = access(data, 'viewer.survey.id');
      const hasFinished = access(data, 'viewer.survey.hasFinished');
      const estimatedW2Income = access(data, 'viewer.income.estimatedW2Income');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );
      const isLegacy = !!access(data, 'viewer.user.confidence.taxesConfidence');
      const taxStatus = access(data, 'viewer.taxGoal.status');

      Log.debug(questions);

      return children({
        estimated1099Income,
        estimatedW2Income,
        hasFinished,
        taxStatus,
        questions,
        surveyID,
        workType,
        isLegacy,
        loading,
        error,
      });
    }}
  </Query>
);

export default CheckupQuestions;
