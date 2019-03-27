/**
 * TransferFundsView
 *
 * This view handles the introductory and transfer steps of a user's transfer of funds to/from Catch.
 * By default, we allow them to choose whether they want to deposit or withdraw funds, and then render the transfer navigator
 * with the appropriate mutation rendered from the TransferFunds component
 */

import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { formValueSelector, destroy } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { Platform, TouchableOpacity, SafeAreaView, View } from 'react-native';

import {
  Figure,
  Box,
  H3,
  Text,
  withDimensions,
  styles,
  Spinner,
  CenterFrame,
} from '@catch/rio-ui-kit';
import { createLogger, Segment, Env, goTo } from '@catch/utils';

import {
  TransferFunds,
  TransferFundsQuery,
  TransferFundsSteps,
} from '../containers';

const Log = createLogger('transfer-funds-view');

const PREFIX = 'catch.plans.TransferFundsView';
export const COPY = {
  deposit: <FormattedMessage id={`${PREFIX}.deposit`} />,
  withdraw: <FormattedMessage id={`${PREFIX}.withdraw`} />,
};

const isWeb = Platform.OS === 'web';

export class TransferFundsView extends React.Component {
  static propTypes = {
    goalType: PropTypes.string,
    transferAmount: PropTypes.number,
    initialTransferAmount: PropTypes.number,
  };

  static defaultProps = {
    initialTransferAmount: 0,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      transferStage: null,
      transferType: props.planTransferType || null,
    };
  }
  setTransferType = ({ transferType }) => {
    this.setState({ transferType: transferType, transferStage: 'config' });
  };

  setTransferStep = ({ transferType, transferStage }) => {
    this.setState({ transferStage: transferStage, transferType: transferType });
  };

  componentWillUnmount() {
    this.props.destroyForm();
  }

  render() {
    const {
      targetGoal,
      transferAmount,
      refetch,
      breakpoints,
      toggleParentModal,
      initialTransferAmount,
      goalType,
    } = this.props;

    const { transferType } = this.state;

    Log.info({ targetGoal, goalType, transferAmount });

    return (
      <TransferFundsQuery
        goalType={goalType}
        transferAmount={Number(transferAmount)}
        transferType={transferType}
      >
        {({
          goalIDs,
          goalBalances,
          goalsAvailableForTransfers,
          goalBalanceTotal,
          loading,
          ...queryProps
        }) => {
          Log.info({ queryProps });

          const formGoalType =
            !goalType &&
            goalsAvailableForTransfers &&
            goalsAvailableForTransfers.length === 1
              ? goalsAvailableForTransfers[0].goalName
              : Object.keys(goalIDs).find(key => goalIDs[key] === targetGoal);

          if (loading)
            return (
              <View
                style={styles.get([
                  'LgMargins',
                  'LgTopSpace',
                  'LgBottomSpace',
                  'CenterColumn',
                ])}
              >
                <Spinner large />
              </View>
            );

          return !!transferType ? (
            <SafeAreaView style={styles.get('Flex1')}>
              <TransferFunds
                transferType={this.state.transferType}
                onCompleted={async () => {
                  if (transferType === 'deposit') {
                    Segment.fundsDeposited(transferAmount);
                  }
                  await this.setState({ transferStage: 'success' });
                  setTimeout(() => refetch && refetch(), 4500);
                }}
              >
                {({ onTransfer, transferring }) => (
                  <TransferFundsSteps
                    onTransfer={() =>
                      onTransfer({
                        variables: {
                          input: {
                            amount: transferAmount,
                            goalID: goalType
                              ? goalIDs[goalType]
                              : targetGoal || goalIDs[formGoalType], // targetGoal isn't always available because we dont render the GoalTransferForm when the amount of available goals to transfer against !== 1
                            goalType: goalType || formGoalType,
                          },
                        },
                      })
                    }
                    goTo={this.goTo}
                    setTransferStep={this.setTransferStep}
                    transferStage={this.state.transferStage}
                    transferType={transferType}
                    transferring={transferring}
                    goalType={goalType}
                    goalIDs={goalIDs}
                    formGoalType={formGoalType}
                    goalBalances={goalBalances}
                    goalsAvailableForTransfers={goalsAvailableForTransfers}
                    initialTransferAmount={initialTransferAmount}
                    {...this.props}
                    {...queryProps}
                  />
                )}
              </TransferFunds>
            </SafeAreaView>
          ) : (
            <Box p={4} align="center">
              <H3>Transfer funds</H3>
              <Box my={5} justify="center" row>
                <Box>
                  <TouchableOpacity
                    onPress={() =>
                      this.setTransferType({
                        transferType: 'deposit',
                      })
                    }
                  >
                    <Figure name="deposit" />
                  </TouchableOpacity>
                  <Text
                    color="link"
                    weight="medium"
                    style={{ maxWidth: 100 }}
                    onClick={() =>
                      this.setTransferType({
                        transferType: 'deposit',
                      })
                    }
                    center
                  >
                    {COPY['deposit']}
                  </Text>
                </Box>

                {((goalType &&
                  goalType !== 'RETIREMENT' &&
                  goalBalances[goalType] > 0) ||
                  (!goalType && goalBalanceTotal > 0)) && (
                  <Box ml={3}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setTransferType({
                          transferType: 'withdraw',
                        })
                      }
                    >
                      <Figure name="withdrawal" />
                    </TouchableOpacity>
                    <Text
                      color="link"
                      weight="medium"
                      style={{ maxWidth: 100 }}
                      onClick={() =>
                        this.setTransferType({
                          transferType: 'withdraw',
                        })
                      }
                      center
                    >
                      {COPY['withdraw']}
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          );
        }}
      </TransferFundsQuery>
    );
  }
}

const withFormValues = connect(
  state => ({
    targetGoal: formValueSelector('TransferFundsForm')(state, 'targetGoal'),
    transferAmount: formValueSelector('TransferFundsForm')(
      state,
      'transferAmount',
    ),
  }),
  {
    destroyForm: () => destroy('TransferFundsForm'),
  },
);

const enhance = compose(
  withDimensions,
  withFormValues,
);

const Component = enhance(TransferFundsView);
Component.displayName = 'TransferFundsView';

export default Component;
