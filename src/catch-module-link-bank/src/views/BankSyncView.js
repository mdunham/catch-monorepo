import React from 'react';
import { Platform, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import { styles, withDimensions, ProgressBar } from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  getRouteState,
  mergeOptions,
} from '@catch/utils';

import { selectors, actions, STAGES } from '../store';
import { SyncStatus, BankAccounts } from '../containers';

import { SyncHeader } from '../components';

const PREFIX = 'catch.module.link-bank.BankSyncView';
export const COPY = {
  'tidbit.title': <FormattedMessage id={`${PREFIX}.tidbit.title`} />,
  'tidbit.body': <FormattedMessage id={`${PREFIX}.tidbit.body`} />,
};

export class BankSyncView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.mergeOptions = mergeOptions.bind(this);
  }
  componentDidMount() {
    // Hide the navigation so user don't quit the bank link while it's processing
    this.mergeOptions({
      topBar: {
        visible: false,
      },
    });
  }

  handleComplete = id => {
    if (id) {
      this.handleFinish(id);
      return;
    }
    this.handleSelection();
  };

  handleFinish = id => {
    const { reset, selectPrimaryAccount } = this.props;
    selectPrimaryAccount(id);
  };

  handleSelection = _ => {
    const { finishLink, navigation, bank, bankLinkId } = this.props;
    finishLink();
    Platform.OS !== 'web' && this.goTo(`/link-bank/${STAGES.primarySelection}`);
  };

  handleError = error => {
    const { failedLink, navigation, bank, bankLinkId } = this.props;
    failedLink(error);
    Platform.OS !== 'web' && this.goTo(`/link-bank/${STAGES.challenging}`);
  };

  render() {
    const {
      failedLink,
      finishLink,
      bankLinkId,
      bank,
      breakpoints,
      stage,
    } = this.props;
    return (
      <View
        style={styles.get(
          ['Container', 'ModalMax', 'SmTopSpace', 'Margins'],
          breakpoints.current,
        )}
      >
        <BankAccounts bankLinkId={bankLinkId}>
          {({ accounts, primaryAccountId, refetch }) => (
            <SyncStatus
              onError={this.handleError}
              onCheckAccounts={refetch}
              accounts={accounts}
              hasPrimaryBankLink={Boolean(primaryAccountId)}
              onComplete={this.handleComplete}
              breakpoints={breakpoints}
              bank={bank}
              stage={stage}
              id={bankLinkId}
            />
          )}
        </BankAccounts>
        <View style={styles.get('Container')}>
          <Text
            style={styles.get(
              ['FinePrint', 'CenterText', 'TopGutter', 'BottomGutter'],
              breakpoints.current,
            )}
          >
            {COPY['tidbit.title']}
          </Text>
          <Text
            style={styles.get(
              ['FinePrint', 'CenterText', 'BottomGutter', 'SubtleText'],
              breakpoints.current,
            )}
          >
            {COPY['tidbit.body']}
          </Text>
        </View>
      </View>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    bank: selectors.getBank,
    bankLinkId: selectors.getBankLinkId,
    challengeType: selectors.getChallengeType,
    stage: selectors.getStage,
  }),
  {
    reset: actions.reset,
    selectPrimaryAccount: actions.selectPrimaryAccount,
    failedLink: actions.failedLink,
    finishLink: actions.finishLink,
  },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(BankSyncView);
