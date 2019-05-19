import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { FormattedMessage } from 'react-intl';
import { submit, destroy } from 'redux-form';

import {
  Label,
  Text,
  Spinner,
  styles,
  Button,
  Icon,
  colors,
} from '@catch/rio-ui-kit';

import { actions, selectors as sel } from '../store';
import { ChangeEmailForm, ConfirmEmailForm } from '../forms';
import { EmailModalHeader } from '../components';
import ViewerEmail from './ViewerEmail';

const PREFIX = 'catch.module.me.ChangeCredentials';
export const COPY = {
  'EmailModalHeader.title': (
    <FormattedMessage id={`${PREFIX}.EmailModalHeader.title`} />
  ),
  'EmailModalHeader.caption': (
    <FormattedMessage id={`${PREFIX}.EmailModalHeader.caption`} />
  ),
  emailLabel: <FormattedMessage id={`${PREFIX}.emailLabel`} />,
  currentEmailLabel: <FormattedMessage id={`${PREFIX}.currentEmailLabel`} />,
  emailConfirmationTitle: (
    <FormattedMessage id={`${PREFIX}.emailConfirmationTitle`} />
  ),
  emailConfirmationCaption: values => (
    <FormattedMessage
      id={`${PREFIX}.emailConfirmationCaption`}
      values={values}
    />
  ),
  emailButton: <FormattedMessage id={`${PREFIX}.emailButton`} />,
};

export class ChangeEmail extends React.Component {
  static propTypes = {
    // Redux connected props
    isEmailChanging: PropTypes.bool.isRequired,
    isRequestingCode: PropTypes.bool,
    isCodeSubmitting: PropTypes.bool,
    newEmailAddress: PropTypes.string,
    submitCode: PropTypes.func,
    submitEmail: PropTypes.func,
    toggleModal: PropTypes.func,
    // Passed only when this component is rendered inside a modal.
    // If not we render a query to obtain the email and assume a default of
    // `PhoneOnly` dimensions
    viewport: PropTypes.string,
    emailAddress: PropTypes.string,
  };

  state = {
    keyboardKey: 'KeyboardKey',
  };

  componentDidMount() {
    if (Platform.OS !== 'web') {
      /**
       * The KeyboardAvoidingView uses `height` mode, so the container
       * will shrink when the keyboard pops up however it does not extend back if the
       * user dismisses the keyboard therefore we must update the key in order to rerender
       */
      this.keyboardListener = Keyboard.addListener(
        Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
        this.handleKeyboard,
      );
    }
  }
  componentWillUnmount() {
    if (this.keyboardListener) {
      this.keyboardListener.remove();
    }
    /**
     * We keep the forms during the flow but destroy them
     * when this component unmounts
     */
    this.props.destroyForms();
  }

  handleKeyboard = () => {
    this.setState({
      keyboardKey: `KeyboardKey-${Date.now()}`,
    });
  };

  handleEmail = values => {
    this.props.changeEmail(values);
  };

  handleCode = values => {
    const { newEmailAddress } = this.props;
    this.props.confirmEmail({
      callback: this.handleNativeBack,
      email: newEmailAddress,
      ...values,
    });
  };

  handleNativeBack = () => {
    if (Platform.OS !== 'web') {
      this.props.navigation.goBack(null);
    }
  };

  renderContent = ({ emailAddress, loading }) => {
    const {
      isRequestingCode,
      isCodeSubmitting,
      isEmailChanging,
      newEmailAddress,
      viewport = 'PhoneOnly',
      submitCode,
      submitEmail,
      toggleModal,
    } = this.props;

    const containerStyles = styles.get(
      ['Container', 'ModalMax', 'SmTopSpace', 'BottomSpace'],
      viewport,
    );

    return isRequestingCode ? (
      <KeyboardAvoidingView
        key={this.state.keyboardKey}
        behavior={Platform.select({ ios: 'height' })}
        style={containerStyles}
      >
        <ScrollView style={styles.get('Margins', viewport)}>
          {Platform.OS === 'web' &&
            viewport === 'PhoneOnly' && (
              <View
                style={styles.get([
                  'RowContainer',
                  'TopGutter',
                  'BottomGutter',
                ])}
              >
                <Icon
                  name="right"
                  onClick={toggleModal}
                  fill={colors.primary}
                  dynamicRules={{ paths: { fill: colors.primary } }}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </View>
            )}
          <EmailModalHeader
            title={COPY['emailConfirmationTitle']}
            caption={COPY['emailConfirmationCaption']({
              userEmail: newEmailAddress,
            })}
          />
          <ConfirmEmailForm onSubmit={this.handleCode} />
        </ScrollView>
        <View
          style={styles.get(['BottomBar', 'Margins', 'ContainerRow'], viewport)}
        >
          <View style={styles.get('CenterRightRow')}>
            <Button
              loading={isCodeSubmitting}
              onClick={submitCode}
              wide={viewport === 'PhoneOnly'}
            >
              Confirm
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    ) : (
      <KeyboardAvoidingView
        key={this.state.keyboardKey}
        behavior={Platform.select({ ios: 'height' })}
        style={containerStyles}
      >
        <ScrollView style={styles.get('Margins', viewport)}>
          {Platform.OS === 'web' &&
            viewport === 'PhoneOnly' && (
              <View
                style={styles.get([
                  'RowContainer',
                  'TopGutter',
                  'BottomGutter',
                ])}
              >
                <Icon
                  name="right"
                  onClick={toggleModal}
                  fill={colors.primary}
                  dynamicRules={{ paths: { fill: colors.primary } }}
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </View>
            )}
          <EmailModalHeader
            title={COPY['EmailModalHeader.title']}
            caption={COPY['EmailModalHeader.caption']}
          />
          <Label>{COPY['currentEmailLabel']}</Label>
          {loading ? (
            <Spinner />
          ) : (
            <Text weight="medium" mb={3}>
              {emailAddress}
            </Text>
          )}
          <ChangeEmailForm onSubmit={this.handleEmail} />
        </ScrollView>
        <View
          style={styles.get(['BottomBar', 'Margins', 'ContainerRow'], viewport)}
        >
          <View style={styles.get('CenterRightRow')}>
            <Button
              loading={isEmailChanging}
              onClick={submitEmail}
              wide={viewport === 'PhoneOnly'}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  };

  render() {
    const { emailAddress } = this.props;
    /**
     * If this component is rendered inside the modal, the email address is
     * available in the props else we render the query
     */
    return emailAddress ? (
      this.renderContent({ emailAddress })
    ) : (
      <ViewerEmail>
        {({ loading, emailAddress }) =>
          this.renderContent({ emailAddress, loading })
        }
      </ViewerEmail>
    );
  }
}
export default connect(
  createStructuredSelector({
    isEmailChanging: sel.getIsEmailChanging,
    isRequestingCode: sel.getIsRequestingCode,
    isCodeSubmitting: sel.getIsCodeSubmitting,
    newEmailAddress: sel.getNewEmailAddress,
  }),
  {
    submitEmail: () => submit('ChangeEmailForm'),
    submitCode: () => submit('ConfirmEmailForm'),
    destroyForms: () => destroy('ChangeEmailForm', 'ConfirmEmailForm'),
    ...actions,
  },
)(ChangeEmail);
