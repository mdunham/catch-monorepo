import React from 'react';
import PropTypes from 'prop-types';
import { FlatList, PushNotificationIOS, Platform } from 'react-native';

import { IncomeCard, MinIncomeCard } from '../components';

const ITEM_HEIGHT = 195;

/**
 * @NOTE: Quite hard to fully leverage the power of this virtualized list
 * because of the two column layout. We need to use proper pagination
 * and lazy loading which this component will help facilitate
 */
class NotificationList extends React.PureComponent {
  componentDidMount() {
    this.handleAppBadgeCount();
  }
  componentDidUpdate(prevProps) {
    const { items } = this.props;
    if (prevProps.items.length !== items.length) {
      this.handleAppBadgeCount();
    }
  }
  /**
   * Temporary way of handling notifications, in the near future,
   * the api will provide a notificationCount field so it can all be handled
   * in the Notifications class.
   */
  handleAppBadgeCount = () => {
    if (Platform.OS === 'ios') {
      const { items } = this.props;
      const notificationCount = items.length;
      PushNotificationIOS.setApplicationIconBadgeNumber(notificationCount);
    }
  };
  static propTypes = {
    onRejectIncome: PropTypes.func.isRequired,
    onValidateIncome: PropTypes.func.isRequired,
  };
  renderItem = ({ item }) => {
    const { onRejectIncome, onValidateIncome, status, viewport } = this.props;

    const minimize = [
      'PLAN_STARTED',
      'PLAN_PROCESSING',
      'PENDING_REWARD_NO_GOALS',
      'LOCKED_OUT',
    ].includes(status);
    if (minimize) return <MinIncomeCard date={item.date} />;
    return (
      <IncomeCard
        bank={item.account}
        amount={item.amount}
        date={item.date}
        onReject={() => onRejectIncome(item)}
        onValidate={() => onValidateIncome(item)}
        disabled={
          status === 'BANKLINK_LOGIN_ERROR' ||
          status === 'NEEDS_IDV' ||
          status === 'ALL_GOALS_PAUSED' ||
          status === 'LOCKED_OUT'
        }
        viewport={viewport}
      />
    );
  };
  render() {
    const { items } = this.props;
    return (
      <FlatList
        data={items}
        extraData={this.props}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    );
  }
}

export default NotificationList;
