import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Platform,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { Spinner, Icon, styles, colors } from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';

// Form Types
import BankMFAQuestionForm from '../../forms/BankMFAQuestionForm';
import BankMFAMultipleChoiceForm from '../../forms/BankMFAMultipleChoiceForm';
import BankMFAImageForm from '../../forms/BankMFAImageForm';
import { bankColorNames } from '../../const';
import { SyncHeader } from '../../components';

const Log = createLogger('question-challenge');

const PREFIX = 'catch.module.link-bank.QuestionChallenge';
export const COPY = {
  questionTitle: <FormattedMessage id={`${PREFIX}.questionTitle`} />,
  imageTitle: <FormattedMessage id={`${PREFIX}.imageTitle`} />,
  realtimeTitle: <FormattedMessage id={`${PREFIX}.realtimeTitle`} />,
};

class QuestionChallenge extends Component {
  static propTypes = {
    onComplete: PropTypes.func.isRequired,
    onAnswer: PropTypes.func.isRequired,
    bankLinkId: PropTypes.string.isRequired,
    challenges: PropTypes.array.isRequired,
  };

  state = { challengesAnswered: 0, isAnswering: false };

  onNext = () => {
    const numQuestions = this.props.challenges.length;
    if (numQuestions - 1 === this.state.challengesAnswered) {
      this.props.onComplete();
      Log.debug('onComplete()');
    } else {
      this.setState({ challengesAnswered: this.state.challengesAnswered + 1 });
      Log.debug('new challenge');
    }
  };

  handleSubmit = (challengeId, { answer }) => {
    const { onAnswer, bankLinkId } = this.props;
    this.setState({ isAnswering: true });
    onAnswer({
      answer,
      challengeId,
      bankLinkId,
    })
      .then(data => {
        this.setState({ isAnswering: false });
        this.onNext();
      })
      .catch(e => {
        this.setState({ isAnswering: false, error: e.message });
      });
  };

  render() {
    const {
      challenges,
      bankName,
      breakpoints,
      onBack,
      loading,
      error,
    } = this.props;
    const { isAnswering, challengesAnswered } = this.state;

    if (loading || error) {
      return (
        <View style={styles.get(['CenterColumn', 'LgTopSpace'])}>
          <Spinner large />
        </View>
      );
    }

    const challenge = challenges[challengesAnswered] || {};

    Log.debug(challenges);

    let Form, title;
    switch (challenge.challengeType) {
      case 'realtime':
        title = COPY['realtimeTitle'];
        Form = BankMFAQuestionForm;
        break;
      case 'question':
        title = COPY['questionTitle'];
        Form = BankMFAQuestionForm;
        break;
      case 'prerealtime':
        title = COPY['realtimeTitle'];
        Form = BankMFAMultipleChoiceForm;
        break;
      case 'choices':
        title = COPY['imageTitle'];
        Form = BankMFAMultipleChoiceForm;
        break;
      case 'image':
        title = COPY['imageTitle'];
        Form = BankMFAImageForm;
        break;
      default:
        title = COPY['questionTitle'];
        Form = BankMFAQuestionForm;
    }

    return (
      <View style={styles.get(['Container', 'ModalMax'], breakpoints.current)}>
        {Platform.OS === 'web' &&
          breakpoints.select({
            PhoneOnly: (
              <View
                style={styles.get([
                  'RowContainer',
                  'TopGutter',
                  'SmMargins',
                  'BottomGutter',
                ])}
              >
                <Icon
                  name="right"
                  onClick={onBack}
                  fill={colors.primary}
                  stroke={colors.primary}
                  dynamicRules={{ paths: { fill: colors.primary } }}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </View>
            ),
          })}
        <Form
          key={challenge.challengeId}
          onSubmit={this.handleSubmit.bind(this, challenge.challengeId)}
          challenge={challenge}
          isLoading={isAnswering}
          title={title}
          bankIcon={bankColorNames[bankName]}
          breakpoints={breakpoints}
        />
      </View>
    );
  }
}

export default QuestionChallenge;
