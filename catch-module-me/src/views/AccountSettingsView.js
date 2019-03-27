import React from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { injectReducer, injectSaga, goTo } from '@catch/utils';
import { styles, withDimensions, Text, Label, Modal } from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { saga, reducer, NAME, actions, selectors as sel } from '../store';
import { SettingsGroup, SettingsLayout } from '../components';
import {
  NotificationSettings,
  ChangePassword,
  ChangeEmail,
  ViewerEmail,
} from '../containers';
import NotificationSettingsView from './NotificationSettingsView';

const PREFIX = 'catch.module.me.AccountSettingsView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  'ChangePassword.title': (
    <FormattedMessage id={`${PREFIX}.ChangePassword.title`} />
  ),
  'NotificationSettings.title': (
    <FormattedMessage id={`${PREFIX}.NotificationSettings.title`} />
  ),
  emailButton: (
    <FormattedMessage id={`catch.module.me.ChangeCredentials.emailButton`} />
  ),
};

export class AccountSettingsView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleEmail = () => {
    if (Platform.OS === 'web') {
      this.props.toggleModal();
    } else {
      this.goTo('/me/settings/email');
    }
  };
  render() {
    const { breakpoints, emailModalVisible, toggleModal } = this.props;
    return (
      <SettingsLayout breakpoints={breakpoints}>
        <SettingsGroup title="Email">
          <ViewerEmail>
            {({ loading, emailAddress }) => (
              <View>
                <Label mb={1}>{emailAddress}</Label>
                <TouchableOpacity onPress={this.handleEmail}>
                  <Text color="link" weight="medium">
                    {COPY['emailButton']}
                  </Text>
                </TouchableOpacity>
                {emailModalVisible && (
                  <Modal
                    viewport={breakpoints.current}
                    onRequestClose={toggleModal}
                  >
                    <ChangeEmail viewport={breakpoints.current} />
                  </Modal>
                )}
              </View>
            )}
          </ViewerEmail>
        </SettingsGroup>
        <ErrorBoundary Component={ErrorMessage} key={2}>
          <NotificationSettingsView
            title={COPY['NotificationSettings.title']}
          />
        </ErrorBoundary>
        <ChangePassword key={3} passwordTitle={COPY['ChangePassword.title']} />
      </SettingsLayout>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    emailModalVisible: sel.getEmailModalVisible,
  }),
  { toggleModal: actions.toggleModal },
);

const withReducer = injectReducer({ key: NAME, reducer });
const withSaga = injectSaga({ key: NAME, saga });

const enhance = compose(
  withDimensions,
  withReducer,
  withSaga,
  withRedux,
);

export default enhance(AccountSettingsView);
