import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import { createLogger } from '@catch/utils';

import { NOTIFICATION_SETTINGS } from './NotificationSettings';

const Log = createLogger('update-notification-settings');

export const UPDATE_NOTIFICATION_SETTINGS = gql`
  mutation UpdateNotificationSettings(
    $input: UpdateNotificationSettingsInput!
  ) {
    updateNotificationSettings(input: $input) {
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
`;

export const UpdateNotificationSettings = ({ children, onCompleted }) => (
  <Mutation
    mutation={UPDATE_NOTIFICATION_SETTINGS}
    onCompleted={onCompleted}
    refetchQueries={[{ query: NOTIFICATION_SETTINGS }]}
  >
    {(updateNotificationSettings, { loading: updating }) => {
      if (updating) Log.debug('updating notification settings');

      return children({ updating, updateNotificationSettings });
    }}
  </Mutation>
);

UpdateNotificationSettings.propTypes = {
  children: PropTypes.func.isRequired,
  onCompleted: PropTypes.func,
};

export default UpdateNotificationSettings;
