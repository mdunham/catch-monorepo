import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Page } from '@catch/rio-ui-kit';
import { Env, Log, goTo } from '@catch/utils';

import { selectors, actions } from '../store';
import { STAGES } from '../store/duck';
import BankLoginForm from '../forms/BankLoginForm';

export class BankLoginView extends React.Component {
  static propTypes = {
    bank: PropTypes.object.isRequired,
    bankLinkId: PropTypes.string,
    error: PropTypes.object,
    isLinking: PropTypes.bool,
    navigation: PropTypes.object,
    reset: PropTypes.func.isRequired,
    stage: PropTypes.string.isRequired,
    startLink: PropTypes.func.isRequired,
    updateLink: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  componentDidUpdate(prevProps) {
    const { stage, navigation, bank, bankLinkId } = this.props;
    if (prevProps.stage === STAGES.fillingIn && stage === STAGES.syncing) {
      this.goTo(`/link-bank/${STAGES.syncing}`);
    }
    if (prevProps.stage === STAGES.fillingIn && stage === STAGES.selecting) {
      this.goTo(`/link-bank/${STAGES.selecting}`);
    }
  }
  handleSubmit = values => {
    const { startLink, bank, bankLinkId, updateLink } = this.props;

    Log.warn(bankLinkId);
    if (bankLinkId) {
      updateLink({
        values: { ...values, bankLinkId },
      });
    } else {
      startLink({
        values: { ...values, bankId: bank.id },
      });
    }
  };

  render() {
    const { bank, reset, isLinking, error } = this.props;
    return (
      <BankLoginForm
        bank={bank}
        errorStatus={error}
        onCancel={reset}
        onSubmit={this.handleSubmit}
        isLinking={isLinking}
      />
    );
  }
}

export default connect(
  createStructuredSelector({
    bank: selectors.getBank,
    bankLinkId: selectors.getBankLinkId,
    isLinking: selectors.getIsLinking,
    stage: selectors.getStage,
    error: selectors.getChallengeType,
  }),
  {
    reset: actions.reset,
    startLink: actions.startLink,
    updateLink: actions.updateLink,
  },
)(BankLoginView);
