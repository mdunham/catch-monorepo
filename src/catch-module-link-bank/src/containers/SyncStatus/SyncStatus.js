/* @flow */
import React, { Component } from 'react';
import { View, Text } from 'react-native'
import {ProgressBar, ErrorBar, styles } from '@catch/rio-ui-kit';
import { seconds, createLogger } from '@catch/utils';
import {
  messageMap,
  toPercentComplete,
  isSynced,
  isSyncError,
  toHumanMessage,
  toHumanError,
  COPY,
  needsBankName,
} from './model';
import { SyncHeader } from '../../components';
import { bankColorNames } from '../../const';

const Log = createLogger('sync-status');

const DEFAULT_STATE = {
  width: 0,
  msg: {
    syncProgressMessage: '',
  },
};

class Status extends Component {
  // for testing purposes
  static defaultProps = {
    initialSpeed: 0.001,
    finishSpeed: 0.01,
  };
  state = DEFAULT_STATE
  componentDidMount() {
    const { sync, onError, startSync } = this.props;
    startSync();
    this.handleProgress();

    if (isSynced(sync)) {
      this.handleNextStep();
    }
    if (isSyncError(sync)) {
      Log.debug('Handling error in 2.5sec...');
      setTimeout(() => onError(sync.syncStatus), seconds(2.5));
    }
  }

  componentDidUpdate(prevProps) {
    const {
      sync,
      error,
      onError,
      accounts,
      onCheckAccounts,
      finishSpeed,
      stage,
      startSync,
    } = this.props;
    if (!isSynced(prevProps.sync) && isSynced(sync)) {
      if (accounts.length === 0) {
        // We usually need to refetch the bank link accounts in order to get fresh
        // accounts, once this is done we complete the progress bar and trigger the callback
        onCheckAccounts().then(data => this.updateProgress(finishSpeed, 0.99, this.handleNextStep))
      } else {
        this.updateProgress(finishSpeed, 0.99, this.handleNextStep);
      }
    }
    if (!isSyncError(prevProps.sync) && isSyncError(sync)) {
      Log.debug('Handling error in 2.5sec...');
      setTimeout(() => onError(sync.syncStatus), seconds(2.5));
    }
    // Graphql error
    if (error) {
      onError('SYSTEM_ERROR');
    }
  }

  handleNextStep = _ => {
    const {
      accounts,
      onCheckAccounts,
      onComplete,
      hasPrimaryBankLink,
    } = this.props;

    Log.debug(accounts);
    if (!!accounts && accounts.length > 0) {
      switch (accounts.length) {
        case 1:
          const { id } = accounts[0];
          // if we have a primaryBankLink already we don't set as primary yet
          onComplete(!hasPrimaryBankLink ? id : undefined);
          return;
        default:
          onComplete();
          return;
      }
    }
  };

  handleProgress = () => {
    const { initialSpeed } = this.props;
    const progress = [];

    const wait = t => new Promise(resolve => setTimeout(resolve, t));

    Object.keys(messageMap).forEach((key, i, arr) => {
      const msg = wait(i * 1500).then(() => {
        // We wait at 0.8 before we finish
        const maxWidth = 0.8 / arr.length * (i + 1);
        Log.warn(maxWidth);
        this.setState(
          {
            msg: {
              syncProgressMessage: key,
            },
          },
          () => this.updateProgress(initialSpeed, maxWidth),
        );
      });
      progress.push(msg);
    });
    return Promise.all(progress);
  };

  updateProgress = (speed, max, cb) => {
    const width = this.state.width + speed;
    this.setState({ width });
    this._frame = window.requestAnimationFrame(() =>
      this.updateProgress(speed, max, cb),
    );
    if (width > max) {
      window.cancelAnimationFrame(this._frame);
      if (cb) cb();
    }
  };

  render() {
    const { bank, sync, breakpoints } = this.props;
    const hasError = isSyncError(sync);
    const title = hasError ? toHumanError(sync).title : COPY['title'];
    const message = hasError
      ? toHumanError(sync).caption
      : toHumanMessage(this.state.msg);
    return hasError ? (
      <View style={styles.get(['Flex2', 'SmMargins', 'LgBottomGutter'])}>
        <SyncHeader title={title} iconName={bankColorNames[bank.name]} viewport={breakpoints.current} />
        <View style={styles.get('LgTopGutter')}>
          <ErrorBar
            message={
              needsBankName(message)
                ? message({ bankName: bank.name })
                : message
            }
          />
        </View>
      </View>
    ) : (
      <View style={styles.get(['Flex2', 'SmMargins', 'LgBottomGutter'])}>
        <SyncHeader title={title} iconName={bankColorNames[bank.name]} viewport={breakpoints.current} />
        <View style={styles.get('LgTopGutter')}>
          <ProgressBar progress={this.state.width} />
          <Text style={styles.get(['BodyLink', 'FullWidth', 'CenterText', 'TopGutter'], breakpoints.current)}>
            {message}
          </Text>
        </View>
      </View>
    );
  }
}

export default Status;
