/**
 * This is a simple navigator essentially doing the same things
 * as react router but without browser routes.
 * import LinkBankView from '../views/LinkBankView';
 * export default LinkBankView;
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';
import { compose } from 'redux';

import { trackIntercom, getRouteState, createLogger } from '@catch/utils';
import {
  Box,
  H3,
  Button,
  Modal,
  ModalBody,
  withDimensions,
} from '@catch/rio-ui-kit';

import { STAGES } from '../store/duck';
import { actions, selectors as sel } from '../store';

import {
  LinkBankView,
  BankLoginView,
  BankSyncView,
  BankAccountView,
  ChallengeView,
  BankSuccessView,
} from '../views';

const Log = createLogger('link-bank');

class LinkBank extends Component {
  static propTypes = {
    reset: PropTypes.func.isRequired,
    viewport: PropTypes.string.isRequired,
    selectLink: PropTypes.func.isRequired,
    selectBank: PropTypes.func.isRequired,

    // Redux State
    stage: PropTypes.string.isRequired,
    bank: PropTypes.object,

    // navigation
    reduxPush: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.getRouteState = getRouteState.bind(this);
  }

  /**
   * Prompts the user if they try to close during syncing
   */
  componentDidMount() {
    window.onbeforeunload = this.handleWindowClose;

    const state = this.getRouteState();
    if (state && state.bankLinkID) {
      this.props.selectLink(state.bankLinkID);
      this.props.selectBank(state.bank);
    }
  }

  handleWindowClose = e => {
    if (this.props.stage === 'syncing') {
      let msg = 'Are you sure?';
      e.returnValue = msg;
      return msg;
    }
  };

  renderStage = () => {
    const { stage, reset, history, reduxPush, breakpoints } = this.props;
    const isMobile = breakpoints.current === 'PhoneOnly';

    switch (stage) {
      case STAGES.selecting:
        return <LinkBankView isMobile={isMobile} history={history} />;
      case STAGES.fillingIn:
        return <BankLoginView />;
      case STAGES.syncing:
        return <BankSyncView history={history} push={reduxPush} />;
      case STAGES.primarySelection:
        return <BankAccountView history={history} push={reduxPush} />;
      case STAGES.challenging:
        return <ChallengeView />;
      case STAGES.complete:
        return <BankSuccessView history={history} push={reduxPush} />;
      default:
        return (
          <Box p={2}>
            <Box mb={2}>
              <H3>Something went wrong</H3>
            </Box>
            <Button onClick={reset}>Back</Button>
          </Box>
        );
    }
  };

  render() {
    const { stage, reset, viewport } = this.props;

    const inModal = stage =>
      [
        'primarySelection',
        'fillingIn',
        'syncing',
        'challenging',
        'complete',
      ].includes(stage);
    return inModal(stage) ? (
      <Modal
        closeOnBackdropClick={stage !== 'syncing'}
        closeOnEsc={true}
        onRequestClose={reset}
        style={{ minHeight: 400 }}
        viewport={viewport}
      >
        {this.renderStage()}
      </Modal>
    ) : (
      this.renderStage()
    );
  }
}

export function registerBankScreens() {}

const withRedux = connect(
  createStructuredSelector({
    stage: sel.getStage,
  }),
  { reduxPush: push, ...actions },
);
const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(LinkBank);
