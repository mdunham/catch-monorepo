import React from 'react';
import { Platform } from 'react-native';
import { withToast } from '@catch/errors';

import NotificationsManager from './Notifications';
import { registerForPushNotifications } from './push';

const withNotifications = WrappedComponent => {
  class WithNotifications extends React.PureComponent {
    constructor() {
      super();
      this.manager = new NotificationsManager();
    }
    componentDidMount() {
      if (Platform.OS !== 'web') {
        registerForPushNotifications();
      }
      this.manager.addListener(this._handleNotification);
    }
    _handleNotification = payload => {
      const msg =
        payload.title ||
        (!!payload.data && payload.data.title) ||
        'Hello World';
      this.props.popToast({ msg });
    };
    render() {
      const {
        popToast,
        popErrorToast,
        toastDisplayed,
        toastHidden,
        ...passThroughProps
      } = this.props;

      return <WrappedComponent {...passThroughProps} />;
    }
  }
  WithNotifications.displayName = `WithNotifications(${getDisplayName(
    WrappedComponent,
  )})`;
  return withToast(WithNotifications);
};

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default withNotifications;
