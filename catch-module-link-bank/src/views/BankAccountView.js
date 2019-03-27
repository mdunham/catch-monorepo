import React from 'react';
import { Platform, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { formValueSelector } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  Button,
  styles,
  withDimensions,
  Icon,
  Text,
  colors,
  Spinner,
} from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  getRouteState,
  trackIntercom,
  createLogger,
} from '@catch/utils';

import { SyncHeader } from '../components';
import { BankAccounts } from '../containers';
import AccountSelectForm from '../forms/AccountSelectForm';
import { selectors, actions, STAGES } from '../store';
import { bankColorNames } from '../const';

const Log = createLogger('account-select');

const PREFIX = 'catch.module.link-bank.BankAccountView';
export const COPY = {
  selectTitle: <FormattedMessage id={`${PREFIX}.selectTitle`} />,
  selectSubtitle: <FormattedMessage id={`${PREFIX}.selectSubtitle`} />,
  selectButton: <FormattedMessage id={`${PREFIX}.selectButton`} />,
  warningTitle: <FormattedMessage id={`${PREFIX}.warningTitle`} />,
  warningSubtitle: <FormattedMessage id={`${PREFIX}.warningSubtitle`} />,
  warningQuestion: values => (
    <FormattedMessage id={`${PREFIX}.warningQuestion`} values={values} />
  ),
  warningDismiss: <FormattedMessage id={`${PREFIX}.warningDismiss`} />,
  warningAccept: <FormattedMessage id={`${PREFIX}.warningAccept`} />,
};

export const createAccountName = ({ accounts, accountSelected }) => {
  const account = !!accountSelected
    ? accounts.find(a => a.id === accountSelected)
    : accounts[0];
  return `${account.nickname || account.name} - ${account.accountNumber.slice(
    account.accountNumber.length - 4,
  )}`;
};

export class BankAccountView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.state = {
      showWarning: false,
    };
  }

  componentDidUpdate(prevProps, preState) {
    const { stage } = this.props;
    if (
      Platform.OS !== 'web' &&
      stage !== prevProps.stage &&
      stage === STAGES.complete
    ) {
      this.handleNextRoute();
    }
  }

  handleNext = ({ isFirstLink }) => {
    if (isFirstLink) {
      this.handleSelect();
    } else {
      this.setState({
        showWarning: true,
      });
    }
  };

  // its safe to assume that if a user gets to this view, the banklink has completed
  handleAnalytics = () => {
    trackIntercom('Has Bank Linked', true);
  };

  handleSelect = firstAccount => {
    if (Platform.OS === 'web') {
      this.handleAnalytics();
    }

    const { accountSelected } = this.props;
    this.props.selectPrimaryAccount(accountSelected || firstAccount);
  };

  handleDismiss = _ => {
    if (Platform.OS === 'web') {
      this.handleAnalytics();
    }

    this.props.setPrimaryAccount();
  };

  handleNextRoute = _ => {
    this.goTo(`/link-bank/${STAGES.complete}`);
  };

  render() {
    const {
      bankLinkId,
      accountSelected,
      breakpoints,
      bank,
      isSelecting,
    } = this.props;
    const { showWarning } = this.state;

    Log.debug(accountSelected);
    return (
      <BankAccounts bankLinkId={bankLinkId}>
        {({ loading, error, accounts, primaryAccountId }) => {
          const warnUser = accounts.length === 1 || showWarning;
          Log.debug(primaryAccountId);
          Log.debug(accounts);
          return loading ? null : (
            <View
              style={styles.get(
                ['Container', 'ModalMax', 'BottomSpace'],
                breakpoints.current,
              )}
            >
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
                        onClick={this.handleNextRoute}
                        fill={colors.primary}
                        stroke={colors.primary}
                        dynamicRules={{ paths: { fill: colors.primary } }}
                        style={{ transform: [{ rotate: '180deg' }] }}
                      />
                    </View>
                  ),
                })}
              <ScrollView
                contentContainerStyle={styles.get(
                  ['Margins', 'XlBottomGutter'],
                  breakpoints.current,
                )}
              >
                <SyncHeader
                  viewport={breakpoints.current}
                  iconName={bankColorNames[bank.name]}
                  title={
                    showWarning ? COPY['warningTitle'] : COPY['selectTitle']
                  }
                  subtitle={
                    showWarning
                      ? COPY['warningSubtitle']
                      : COPY['selectSubtitle']
                  }
                />
                {warnUser ? (
                  isSelecting ? (
                    <View
                      style={styles.get([
                        'CenterColumn',
                        'LgTopSpace',
                        'LgBottomSpace',
                      ])}
                    >
                      <Spinner large />
                    </View>
                  ) : (
                    <Text mb={5}>
                      {COPY['warningQuestion']({
                        account: (
                          <Text weight="bold">
                            {createAccountName({ accounts, accountSelected })}
                          </Text>
                        ),
                      })}
                    </Text>
                  )
                ) : (
                  <AccountSelectForm
                    destroyOnUnmount={false}
                    accounts={accounts}
                    breakpoints={breakpoints}
                    initialValues={
                      accounts[0]
                        ? { accountSelected: accounts[0].id }
                        : undefined
                    }
                  />
                )}
              </ScrollView>
              {warnUser ? (
                <View
                  style={styles.get(
                    ['BottomBar', 'Margins', 'ContainerRow'],
                    breakpoints.current,
                  )}
                >
                  <View style={styles.get('CenterRightRow')}>
                    <View
                      style={breakpoints.select({
                        PhoneOnly: styles.get('Container'),
                      })}
                    >
                      <Button
                        viewport={breakpoints.current}
                        type="light"
                        disabled={isSelecting}
                        wide={breakpoints.select({
                          PhoneOnly: true,
                        })}
                        onClick={this.handleDismiss}
                      >
                        {COPY['warningDismiss']}
                      </Button>
                    </View>
                    <View
                      style={styles.get([
                        'LeftGutter',
                        breakpoints.select({ PhoneOnly: 'Container' }),
                      ])}
                    >
                      <Button
                        viewport={breakpoints.current}
                        disabled={isSelecting}
                        wide={breakpoints.select({
                          PhoneOnly: true,
                        })}
                        onClick={() =>
                          this.handleSelect((accounts[0] || {}).id)
                        }
                      >
                        {COPY['warningAccept']}
                      </Button>
                    </View>
                  </View>
                </View>
              ) : (
                <View
                  style={styles.get(
                    ['BottomBar', 'Margins', 'ContainerRow'],
                    breakpoints.current,
                  )}
                >
                  <View style={styles.get('CenterRightRow')}>
                    <Button
                      viewport={breakpoints.current}
                      disabled={!accountSelected}
                      onClick={() =>
                        this.handleNext({
                          isFirstLink: !Boolean(primaryAccountId),
                        })
                      }
                      wide={breakpoints.select({ PhoneOnly: true })}
                    >
                      {COPY['selectButton']}
                    </Button>
                  </View>
                </View>
              )}
            </View>
          );
        }}
      </BankAccounts>
    );
  }
}

const selector = formValueSelector('accountSelectForm');

const withRedux = connect(
  createStructuredSelector({
    stage: selectors.getStage,
    bankLinkId: selectors.getBankLinkId,
    accountSelected: state => selector(state, 'accountSelected'),
    nextPath: selectors.getNextPath,
    bank: selectors.getBank,
    isSelecting: selectors.getIsSelecting,
  }),
  {
    reset: actions.reset,
    selectPrimaryAccount: actions.selectPrimaryAccount,
    setPrimaryAccount: actions.setPrimaryAccount,
  },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(BankAccountView);
