import { client } from '@catch/apollo';
import gql from 'graphql-tag';

const PUSH_SETTINGS = gql`
  query HasPushEnabled {
    viewer {
      notificationSettings {
        pushTokens {
          id
          token
          deviceType
        }
      }
    }
  }
`;

const PUSH_TOKEN = gql`
  mutation AddPushToken($token: String!, $deviceType: DeviceType!) {
    addPushToken(token: $token, deviceType: $deviceType) {
      id
      token
      deviceType
    }
  }
`;

export const enablePushNotifications = ({ token, deviceType }) =>
  client.mutate({ mutation: PUSH_TOKEN, variables: { token, deviceType } });

export const checkPushSettings = () =>
  client.query({ query: PUSH_SETTINGS, fetchPolicy: 'network-only' });
