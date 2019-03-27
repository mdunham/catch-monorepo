import React from 'react';

import AnswerChallenge from './AnswerChallenge';
import BankLinkChallenges from './BankLinkChallenges';
import QuestionChallenge from './QuestionChallenge';

const ChallengeError = props => (
  <BankLinkChallenges bankLinkId={props.bankLinkId}>
    {({ challenges, bankName, ...queryStatus }) => (
      <AnswerChallenge>
        {({ onAnswer, ...mutationStatus }) => (
          <QuestionChallenge
            challenges={challenges}
            bankName={bankName}
            onAnswer={onAnswer}
            loading={queryStatus.loading || mutationStatus.loading}
            error={queryStatus.error || mutationStatus.error}
            {...props}
          />
        )}
      </AnswerChallenge>
    )}
  </BankLinkChallenges>
);

export default ChallengeError;
