import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Spinner } from '@catch/rio-ui-kit';
import {
  NotificationSettings,
  UpdateNotificationSettings,
} from '@catch/common';

import { NotificationGroupForm } from '../forms';

const PREFIX = 'catch.module.me.NotificationSettingsView';
export const COPY = {
  coveredAccountStatus: (
    <FormattedMessage id={`${PREFIX}.coveredAccountStatus`} />
  ),
  incomeStatus: <FormattedMessage id={`${PREFIX}.incomeStatus`} />,
  linkedAccountStatus: (
    <FormattedMessage id={`${PREFIX}.linkedAccountStatus`} />
  ),
  planStatus: <FormattedMessage id={`${PREFIX}.planStatus`} />,
  planActivity: <FormattedMessage id={`${PREFIX}.planActivity`} />,
};

const labels = {
  coveredAccountStatus: 'Catch Account Status',
  incomeStatus: 'Income Status',
  linkedAccountStatus: 'Linked Account Status',
  planStatus: 'Plan Status',
  planActivity: 'Plan Activity',
};

export class NotificationSettingsView extends Component {
  static propTypes = {
    formValues: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  };

  /**
   * Removes __typename from graphql response
   *
   * @param {object} notifications - the group of notifications to filter through
   */
  filter = notifications => {
    return Object.keys(notifications)
      .filter(key => key !== '__typename')
      .reduce((obj, key) => {
        obj[key] = notifications[key];
        return obj;
      }, {});
  };

  render() {
    const { title } = this.props;
    return (
      <NotificationSettings>
        {({ loading, error, notificationSettings }) =>
          loading ? (
            <Spinner />
          ) : (
            <UpdateNotificationSettings>
              {({ updateNotificationSettings, updating }) => (
                <NotificationGroupForm
                  title={title}
                  notificationsType="email"
                  initialValues={this.filter(notificationSettings.email)}
                  notifications={this.filter(notificationSettings.email)}
                  labels={COPY}
                  update={updateNotificationSettings}
                />
              )}
            </UpdateNotificationSettings>
          )
        }
      </NotificationSettings>
    );
  }
}

export default NotificationSettingsView;
