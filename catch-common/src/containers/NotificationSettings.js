import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';

import { createLogger } from '@catch/utils';
import { Error } from '@catch/errors';

const Log = createLogger('notification-settings');

export const NOTIFICATION_SETTINGS = gql`
  query NotificationSettings {
    viewer {
      notificationSettings {
        push {
          incomeStatus
          planStatus
          coveredAccountStatus
          linkedAccountStatus
        }
        email {
          linkedAccountStatus
          planStatus
          planActivity
        }
      }
    }
  }
`;

export const NotificationSettings = ({ children }) => (
  <Query query={NOTIFICATION_SETTINGS} fetchPolicy="cache-and-network">
    {({ loading, error, data }) => {
      const notificationSettings = access(data, 'viewer.notificationSettings');

      Log.debug({ notificationSettings });

      return children({
        loading,
        error,
        notificationSettings,
      });
    }}
  </Query>
);

export default NotificationSettings;
