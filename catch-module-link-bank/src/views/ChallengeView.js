import React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { withDimensions } from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes } from '@catch/utils';
import { STAGES } from '../store/duck';
import { actions, selectors as sel } from '../store';
import { QuestionChallenge, ConfigChallenge } from '../containers';
import { DefaultError } from '../components';

export class ChallengeView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(prop) {
    super(prop);
    this.goTo = goTo.bind(this);
  }
  handleQuestionsAnswered = () => {
    const { bankLinkId } = this.props;
    this.props.createdLink(bankLinkId);
    if (Platform.OS !== 'web') this.goTo(`/link-bank/${STAGES.syncing}`);
  };
  retryLogin = () => {
    const goTo = Platform.select({
      web: this.props.goTo,
      default: stage => this.goTo(`/link-bank/${stage}`, {}, 'RESET'),
    });
    goTo(STAGES.fillingIn);
  };

  render() {
    const { reset, bankLinkId, challengeType, bank, breakpoints } = this.props;
    switch (challengeType) {
      case 'CONFIG_ERROR':
        return (
          <ConfigChallenge
            bankLinkId={bankLinkId}
            onRetry={this.retryLogin}
            bankName={bank.name}
            breakpoints={breakpoints}
            onBack={this.retryLogin}
          />
        );
      case 'CHALLENGE_ERROR':
        return (
          <QuestionChallenge
            onComplete={this.handleQuestionsAnswered}
            onCancel={reset}
            onBack={this.retryLogin}
            bankLinkId={bankLinkId}
            breakpoints={breakpoints}
          />
        );
      // These errors will be redirecting to Bank Login
      case 'NO_ACCOUNTS_ERROR':
      case 'LOGIN_ERROR':
      case 'SYSTEM_ERROR':
      default:
        return (
          <DefaultError
            onRetry={this.retryLogin}
            bankName={bank.name}
            breakpoints={breakpoints}
            onBack={this.retryLogin}
          />
        );
    }
  }
}

const withRedux = connect(
  createStructuredSelector({
    bankLinkId: sel.getBankLinkId,
    challengeType: sel.getChallengeType,
    bank: sel.getBank,
  }),
  actions,
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(ChallengeView);
