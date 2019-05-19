import React, { Component } from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import { Log, getRouteState, goTo } from '@catch/utils';
import {
  PageWrapper,
  PageTitle,
  SplitLayout,
  Button,
  Flex,
  Box,
  colors,
  styles,
  withDimensions,
} from '@catch/rio-ui-kit';
import { actions, STAGES } from '../store/duck';

import { BankSelect } from '../containers';

const PREFFIX = 'catch.module.link-bank.LinkBankView';

export class LinkBankView extends Component {
  static defaultProps = {
    location: {
      state: {},
    },
    isMobile: true,
  };
  constructor(props) {
    super(props);
    this.getRouteState = getRouteState.bind(this);
    this.goTo = goTo.bind(this);
  }
  componentDidMount() {
    // Cache it in the redux store as the navigator might reset
    // params during navigation
    const nextPath = !!this.getRouteState()
      ? this.getRouteState().nextPath
      : undefined;

    this.props.cacheNextRoute(nextPath);
  }

  handleNext = bank => {
    const { selectBank, navigation } = this.props;
    selectBank(bank);
    Platform.OS !== 'web' && this.goTo(`/link-bank/${STAGES.fillingIn}`);
  };

  render() {
    return (
      <View style={styles.get(['Flex1', 'White', 'CenterColumn'])}>
        <BankSelect onSelect={this.handleNext}>
          <PageTitle
            viewport={this.props.viewport}
            title={<FormattedMessage id={`${PREFFIX}.title`} />}
            subtitle={<FormattedMessage id={`${PREFFIX}.subtitle`} />}
          />
        </BankSelect>
      </View>
    );
  }
}

const withRedux = connect(
  undefined,
  { selectBank: actions.selectBank, cacheNextRoute: actions.cacheNextRoute },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(LinkBankView);
