import React from 'react';
import { View, Text } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { styles, Icon, withDimensions, colors } from '@catch/rio-ui-kit';
import { goTo, navigationPropTypes, Segment } from '@catch/utils';

import { SyncHeader } from '../components';
import { selectors, actions } from '../store';
import { bankColorNames } from '../const';

const PREFIX = 'catch.module.link-bank.BankSuccessView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  caption: <FormattedMessage id={`${PREFIX}.caption`} />,
};

export class BankSuccessView extends React.PureComponent {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  componentDidMount() {
    Segment.bankLinked(!!this.props.bank ? this.props.bank.name : undefined);
    this.timeout = setTimeout(() => this.handleNextRoute(), 1500);
  }
  componentWillUnmount() {
    clearTimeout(this.timeout);
    this.props.reset();
  }
  handleNextRoute = _ => {
    const { nextPath } = this.props;
    if (nextPath) {
      this.goTo(nextPath, {}, 'RESET');
    } else {
      this.goTo('/me/accounts', {}, 'RESET');
    }
  };
  render() {
    const { breakpoints, bank } = this.props;

    // Prevents a possible undefined when we reset the bank selection on unmount
    const bankName =
      !!bank && !!bank.name ? bankColorNames[bank.name] : undefined;
    return (
      <View
        style={styles.get(
          ['CenterColumn', 'ModalMax', 'Margins', 'BottomSpace', 'TopSpace'],
          breakpoints.current,
        )}
      >
        <SyncHeader
          title={COPY['title']}
          iconName={bankName}
          viewport={breakpoints.current}
        />
        <View style={styles.get('LgTopGutter')}>
          <Icon
            name="check"
            fill={colors.primary}
            size={36}
            dynamicRules={{ paths: { fill: colors.primary } }}
          />
        </View>
        <Text
          style={styles.get(
            ['BodyLink', 'CenterText', 'TopGutter'],
            breakpoints.current,
          )}
        >
          {COPY['caption']}
        </Text>
      </View>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    bank: selectors.getBank,
    nextPath: selectors.getNextPath,
  }),
  {
    reset: actions.reset,
  },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(BankSuccessView);
