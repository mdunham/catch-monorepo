import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Box, Icon, colors, Spinner } from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';

import { PlanActivity, TransactionReceipt } from '../containers';
import { ActivityLogList, ReceiptBreakdown } from '../components';

const Log = createLogger('activity-view');

class PlanActivityView extends React.PureComponent {
  static propTypes = {
    goalType: PropTypes.string,
    periodFilter: PropTypes.string,
  };

  state = {
    dpReceipt: null,
    wdReceipt: null,
  };

  handleReceipt = (type, item) => {
    Log.debug(item);
    switch (type) {
      case 'deposit':
        this.setState({ dpReceipt: item });
        break;
      case 'withdrawal':
        this.setState({ wdReceipt: item });
        break;
      default:
        this.setState({
          dpReceipt: null,
          wdReceipt: null,
        });
    }
  };

  render() {
    const { periodFilter, goalType, isMobile, breakpoints } = this.props;
    const { dpReceipt, wdReceipt } = this.state;

    return (
      <React.Fragment>
        <PlanActivity periodFilter={periodFilter} goalType={goalType}>
          {({ loading, error, items }) =>
            loading ? (
              <Box align="center">
                <Spinner large />
              </Box>
            ) : (
              <ActivityLogList
                items={items}
                viewport={breakpoints.current}
                onOpen={this.handleReceipt}
              />
            )
          }
        </PlanActivity>
        {(!!dpReceipt || !!wdReceipt) && (
          <Modal
            viewport={breakpoints.current}
            feature
            onRequestClose={this.handleReceipt}
          >
            {breakpoints.select({
              'PhoneOnly|TabletPortraitUp': (
                <Box
                  style={{ width: '100%', height: 64 }}
                  justify="center"
                  pl={2}
                >
                  <Icon
                    name="close"
                    size={27}
                    fill={colors.ink}
                    dynamicRules={{ paths: { fill: colors.ink } }}
                    onClick={() => this.handleReceipt(undefined)}
                  />
                </Box>
              ),
              TabletLandscapeUp: (
                <Box p={2} pb={1} w={1} align="flex-end">
                  <Icon
                    name="close"
                    size={16}
                    fill={colors['ink+2']}
                    stroke={colors['ink+2']}
                    strokeWidth={2}
                    onClick={() => this.handleReceipt(undefined)}
                  />
                </Box>
              ),
            })}
            {!!dpReceipt &&
              dpReceipt.depositType === 'INCOME' && (
                <TransactionReceipt id={dpReceipt.txID} goalType={goalType}>
                  {({
                    loading,
                    error,
                    status,
                    paycheckID,
                    paycheckAmount,
                    account,
                    date,
                    breakdowns,
                    total,
                    createdOn,
                    savingsBreakdowns,
                    investmentBreakdowns,
                    savingsExpectedDate,
                    savingsTransactionIsPending,
                    wealthExpectedDate,
                    wealthTransactionIsPending,
                    completionDate,
                    paycheckType,
                    savingsCompletionDate,
                    wealthCompletionDate,
                  }) =>
                    loading ? (
                      <Box p={4} align="center">
                        <Spinner large />
                      </Box>
                    ) : (
                      <ReceiptBreakdown
                        type="deposit"
                        txStatus={status}
                        paycheckID={paycheckID}
                        account={account}
                        paycheckDate={date}
                        paycheckAmount={paycheckAmount}
                        breakdowns={breakdowns}
                        total={total}
                        isMobile={isMobile}
                        createdOn={createdOn}
                        savingsBreakdowns={savingsBreakdowns}
                        investmentBreakdowns={investmentBreakdowns}
                        goalType={goalType && goalType.toUpperCase()}
                        depositType={dpReceipt.depositType}
                        savingsExpectedDate={savingsExpectedDate}
                        savingsCompletionDate={savingsCompletionDate}
                        wealthExpectedDate={wealthExpectedDate}
                        wealthCompletionDate={wealthCompletionDate}
                        savingsTransactionIsPending={
                          savingsTransactionIsPending
                        }
                        wealthTransactionIsPending={wealthTransactionIsPending}
                        completionDate={completionDate}
                        paycheckType={paycheckType}
                      />
                    )
                  }
                </TransactionReceipt>
              )}
            {!!wdReceipt && (
              <ReceiptBreakdown
                type={wdReceipt.type}
                txStatus={wdReceipt.status}
                paycheckID={wdReceipt.txID}
                account={wdReceipt.bankReference}
                paycheckDate={wdReceipt.date}
                breakdowns={wdReceipt.breakdowns}
                total={wdReceipt.transferAmount}
                isMobile={isMobile}
                expectedDate={wdReceipt.expectedDate}
                completionDate={wdReceipt.completionDate}
              />
            )}
            {!!dpReceipt &&
              dpReceipt.depositType === 'DEPOSIT' && (
                <ReceiptBreakdown
                  type={dpReceipt.type}
                  txStatus={dpReceipt.status}
                  paycheckID={dpReceipt.txID}
                  paycheckAmount={dpReceipt.amount}
                  paycheckDate={dpReceipt.date}
                  breakdowns={dpReceipt.breakdowns}
                  total={dpReceipt.amount}
                  isMobile={isMobile}
                  depositType={dpReceipt.depositType}
                  bankReference={dpReceipt.bankReference}
                  goalType={goalType || dpReceipt.goalType}
                  expectedDate={dpReceipt.expectedDate}
                  completionDate={dpReceipt.completionDate}
                />
              )}
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default PlanActivityView;
