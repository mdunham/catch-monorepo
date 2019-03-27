import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Box, Divider, Text, styles } from '@catch/rio-ui-kit';
import { formatCurrency, createLogger } from '@catch/utils';

import ActivityCard from './ActivityCard';

const Log = createLogger('activity-log-list');
const isPending = (status, transferType = 'deposit') =>
  status === 'INCOME_ACTION_APPROVED' ||
  status === 'INCOME_ACTION_EXECUTED' ||
  status === 'PROCESSING' ||
  (transferType !== 'withdrawal' && status === 'TRANSACTION_STATUS_PENDING');

/**
 * This list should be highly performant in order to enable smooth pagination
 * and help user scroll fastly through tons of transactions.
 * This is using SectionList as a bit of an experiment.
 */
class ActivityLogList extends React.PureComponent {
  renderItem = ({ item, index, section: { data } }) => (
    <ActivityCard
      key={index}
      type={item.type}
      depositType={item.type === 'deposit' && item.depositType}
      date={item.date}
      goalName={item.goalName}
      status={item.status}
      percentage={item.percentage}
      amount={item.amount}
      total={item.incomeAmount}
      bankReference={item.bankReference}
      isEnd={index === data.length - 1}
      isStart={index === 0}
      onPress={() => this.props.onOpen(item.type, item)}
      viewport={this.props.viewport}
    />
  );
  // We can load the next page here etc...
  handleEndReach = () => Log.debug('End reached');

  render() {
    const { items, viewport } = this.props;

    const section1 = items.filter(item => isPending(item.status, item.type));
    const section2 = items.filter(item => !isPending(item.status, item.type));

    // Checks if there are no txs to display the message
    const isEmpty =
      section2.filter(item => item.type !== 'new-plan').length === 0;

    Log.debug(items);
    return (
      <View style={styles.get(['ContentMax', 'FullWidth'])}>
        {section1.map((item, index) =>
          this.renderItem({ item, index, section: { data: section1 } }),
        )}
        {section2.map((item, index) =>
          this.renderItem({ item, index, section: { data: section2 } }),
        )}
        {//@TODO proper copy
        isEmpty && (
          <View
            style={styles.get(
              ['Margins', 'LgTopGutter', 'XlBottomGutter'],
              viewport,
            )}
          >
            <Text color="ink+1" mb={2} weight="medium" center>
              Welcome to Catch!
            </Text>
            <Text color="ink+1" center>
              Check back after your next paycheck to see a full breakdown of
              your income and benefits.
            </Text>
          </View>
        )}
        {/*
          // @TODO: virtualize this stuff
          // The performance for solution above is very bad
        <SectionList
          contentContainerStyle={[
            styles.container,
            size.window && {
              height: size.window.height - 160,
            },
          ]}
          renderItem={this.renderItem}
          sections={[
            { data: items.filter(item => isPending(item.status)) },
            { data: items.filter(item => !isPending(item.status)) },
          ]}
          keyExtractor={item => item.id}
          refreshing={loading}
          onEndReach={this.handleEndReach}
        /> */}
      </View>
    );
  }
}

export default ActivityLogList;
