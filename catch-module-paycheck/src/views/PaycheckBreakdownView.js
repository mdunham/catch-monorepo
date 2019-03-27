import React from 'react';
import PropTypes from 'prop-types';
import { View, SafeAreaView, ScrollView, Text, Platform } from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { getFormValues, destroy, reset } from 'redux-form';

import { Button, styles, withDimensions, Spinner } from '@catch/rio-ui-kit';
import {
  goTo,
  navigationPropTypes,
  getRouteState,
  FullDate,
  Currency,
  createLogger,
  Redirect,
  Log,
  Segment,
} from '@catch/utils';
import { toastActions } from '@catch/errors';
import { LoadingStatus } from '@catch/common';

import {
  IncomeBreakdown,
  ProcessIncomeTransaction,
  BankLinkStatus,
} from '../containers';
import {
  PaycheckBreakdown,
  BalanceWarningModal,
  CenterFrame,
  PaycheckProcessed,
} from '../components';
import COPY from '../copy';

export function formatGoalApprovals(contributions, values) {
  return contributions.map(c => ({
    incomeTransactionGoalBreakdownID: c.id,
    isApproved: values[c.goalID] || false,
  }));
}

export function calcTotal(contributions, values) {
  return contributions.reduce((total, c) => {
    if (values[c.goalID]) {
      return total + c.amount;
    }
    return total;
  }, 0);
}
// defaults to good
export const balanceStatus = ({ balance = 2, total = 1 }) => {
  if (balance / total < 1.25) {
    return 'LIMITED';
  } else {
    return 'GOOD';
  }
};

const paycheckTypes = {
  WORK_TYPE_1099: 'PAYCHECK_TYPE_1099',
  WORK_TYPE_W2: 'PAYCHECK_TYPE_W2',
};

export class PaycheckBreakdownView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.state = {
      isEditing: false,
      showLimitedModal: false,
    };
  }
  onEdit = () => {
    this.setState({
      isEditing: true,
    });
  };
  toggleLimitedModal = () => {
    this.setState(({ showLimitedModal }) => ({
      showLimitedModal: !showLimitedModal,
    }));
  };
  handleCompleted = total => {
    const { popToast, clearForm } = this.props;
    popToast({
      title: COPY['toastTitle'],
      msg: COPY['toastSubtitle']({
        transferAmount: <Currency>{total}</Currency>,
      }),
      type: 'success',
    });
    clearForm();
    Segment.fundsWithheld(total);
    this.goTo(['/']);
  };
  handleExit = () => {
    this.props.clearForm();
    this.goTo(['/']);
  };
  handleSubmit = async () => {
    await this.breakdownForm.submit();
  };
  get paycheckId() {
    if (Platform.OS === 'web') {
      return this.props.paycheckId;
    } else {
      return this.getRouteState().paycheckId;
    }
  }
  render() {
    const { breakpoints, formValues, clearForm } = this.props;
    const paycheckId = this.paycheckId;
    return (
      <IncomeBreakdown
        id={paycheckId}
        paycheckType={formValues && formValues.paycheckType}
      >
        {({
          loading,
          error,
          amount,
          date,
          contributions,
          ok,
          balance,
          bankName,
          workType,
          actedOn,
          txStatus,
        }) => {
          if (actedOn) {
            return (
              <View
                style={styles.get(
                  [
                    'Container',
                    'CenterColumn',
                    breakpoints.select({
                      'TabletLandscapeUp|TabletPortraitUp': 'TopSpace',
                    }),
                  ],
                  breakpoints.select({
                    'TabletLandscapeUp|TabletPortraitUp': breakpoints.current,
                  }),
                )}
              >
                <CenterFrame
                  breakpoints={breakpoints}
                  actions={[{ text: 'Got it', onPress: this.handleExit }]}
                >
                  <PaycheckProcessed
                    incomeAction={txStatus}
                    date={actedOn}
                    onInfo={() => this.goTo(['/plan'])}
                  />
                </CenterFrame>
              </View>
            );
          }
          const needsTriage = workType === 'WORK_TYPE_DIVERSIFIED';
          /**
           * Safe guard in case a user gets to
           * this route without a required paycheckType
           */
          if (needsTriage && !formValues.paycheckType) {
            return (
              <Redirect
                to={Platform.select({
                  web: `/paycheck/${this.paycheckId}/triage`,
                  default: ['/paycheck', '/triage'],
                })}
                state={{
                  paycheckId: this.paycheckId,
                }}
                {...this.props}
              />
            );
          }
          const total = calcTotal(contributions, formValues);
          const status = balanceStatus({ balance, total });
          const limitedBalance = status === 'LIMITED';
          const insufficientBalance = status === 'INSUFFICIENT';
          const isW2 = formValues.paycheckType === 'PAYCHECK_TYPE_W2';
          // If there are no contributions it means we filtered out taxes
          // and it's the only goal available
          if (!loading && contributions.length === 0) {
            return (
              <Redirect
                to={Platform.select({
                  web: `/paycheck/${this.paycheckId}/reject`,
                  default: ['/paycheck', '/reject'],
                })}
                state={{
                  paycheckId: this.paycheckId,
                  isW2,
                }}
                cb={clearForm}
                {...this.props}
              />
            );
          }
          // Filter out taxes for any further calculations
          // When a use selects a paycheck type during triage the form
          // gets reinitialized with the relevant contributions
          const filteredContributions = isW2
            ? contributions.filter(
                goal => /Tax/.test(goal.description) === false,
              )
            : contributions;

          return (
            <ProcessIncomeTransaction>
              {({ process, result, loading: processing, error }) => (
                <View
                  style={styles.get(
                    ['Flex1', 'White', 'BottomSpace'],
                    breakpoints.current,
                  )}
                >
                  <ScrollView
                    contentContainerStyle={styles.get(['CenterColumn'])}
                  >
                    <View
                      style={styles.get(
                        ['PageWrapper', 'Margins', 'FullWidth'],
                        breakpoints.current,
                      )}
                    >
                      {loading || processing || result ? (
                        <LoadingStatus
                          status={result ? 'success' : 'loading'}
                          onCompleted={() => this.handleCompleted(total)}
                          messages={{
                            loading: COPY['loadingMessage'],
                            success: COPY['successMessage'],
                          }}
                        />
                      ) : (
                        <PaycheckBreakdown
                          ref={el => (this.breakdownForm = el)}
                          initialValues={{
                            ...filteredContributions.reduce(
                              (a, b) => ({ [b.goalID]: true, ...a }),
                              {},
                            ),
                            ...formValues,
                          }}
                          contributions={filteredContributions}
                          formValues={formValues}
                          date={date}
                          amount={amount}
                          onEdit={this.onEdit}
                          isEditing={this.state.isEditing}
                          total={total}
                          onCancel={this.handleExit}
                          breakpoints={breakpoints}
                          loading={loading}
                          onSubmit={values =>
                            limitedBalance && !this.state.showLimitedModal
                              ? this.toggleLimitedModal()
                              : process({
                                  variables: {
                                    incomeInput: {
                                      transactionID: paycheckId,
                                      isApproved: true,
                                      // If mixed it's provided by the form else we get it from the query
                                      paycheckType:
                                        values.paycheckType ||
                                        paycheckTypes[workType],
                                      goalApprovals: formatGoalApprovals(
                                        contributions,
                                        values,
                                      ),
                                    },
                                  },
                                })
                          }
                          isW2={isW2}
                        />
                      )}

                      {/* If the balance is insufficient we trigger the modal on pageload */}
                      {insufficientBalance && (
                        <BalanceWarningModal
                          viewport={breakpoints.current}
                          onDismiss={() => this.goTo(['/'])}
                          title={COPY['InsufficientFundsModal.title']}
                          paragraphs={[
                            COPY['InsufficientFundsModal.p1']({
                              amount: <Currency>{total}</Currency>,
                            }),
                            COPY['InsufficientFundsModal.p2'],
                          ]}
                          dismissText={
                            COPY['InsufficientFundsModal.dismissText']
                          }
                        />
                      )}

                      {/* If it is limited we trigger it when submitting the paycheck as preflight warning */}
                      {limitedBalance &&
                        this.state.showLimitedModal && (
                          <BalanceWarningModal
                            viewport={breakpoints.current}
                            onDismiss={this.toggleLimitedModal}
                            onConfirm={this.handleSubmit}
                            title={COPY['LimitedFundsModal.title']}
                            paragraphs={[
                              COPY['LimitedFundsModal.p1'],
                              COPY['LimitedFundsModal.p2']({
                                amount: <Currency>{total}</Currency>,
                              }),
                            ]}
                            dismissText={COPY['LimitedFundsModal.dismissText']}
                            confirmText={COPY['LimitedFundsModal.confirmText']}
                          />
                        )}
                    </View>
                  </ScrollView>
                  {!processing &&
                    !result &&
                    breakpoints.select({
                      PhoneOnly: (
                        <View
                          style={styles.get(
                            ['BottomBar', 'Margins', 'ContainerRow'],
                            breakpoints.current,
                          )}
                        >
                          <View style={styles.get('CenterRightRow')}>
                            <Button
                              wide
                              onClick={
                                limitedBalance
                                  ? this.toggleLimitedModal
                                  : this.handleSubmit
                              }
                            >
                              {COPY['depositButton']({
                                amount: <Currency>{total}</Currency>,
                              })}
                            </Button>
                          </View>
                        </View>
                      ),
                    })}
                </View>
              )}
            </ProcessIncomeTransaction>
          );
        }}
      </IncomeBreakdown>
    );
  }
}

const withRedux = connect(
  state => ({
    formValues: getFormValues('paycheckSettings')(state) || {},
  }),
  {
    popToast: toastActions.popToast,
    clearForm: () => destroy('paycheckSettings'),
  },
);

const enhance = compose(
  withRedux,
  withDimensions,
);

export default enhance(PaycheckBreakdownView);
