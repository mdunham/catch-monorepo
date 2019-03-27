import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  View,
  Text,
} from 'react-native';
import { Field, reduxForm } from 'redux-form';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import {
  Link,
  Button,
  ReduxInput,
  FakePasswordInput,
  bankColorNames,
  styles,
  withDimensions,
  Spinner,
} from '@catch/rio-ui-kit';
import { createValidator, bankLinkForm } from '@catch/utils';

import { LoginHeader } from '../components';
import { bankColorNames as bankLinkNames } from '../const';

const PREFIX = 'catch.module.link-bank.BankLoginForm';
export const COPY = {
  agreement: <FormattedMessage id={`${PREFIX}.agreement`} />,
  link: <FormattedMessage id={`${PREFIX}.link`} />,
  disclosure: <FormattedMessage id={`${PREFIX}.disclosure`} />,
  button: <FormattedMessage id={`${PREFIX}.button`} />,
  LOGIN_ERROR: <FormattedMessage id={`${PREFIX}.loginError`} />,
  SYSTEM_ERROR: values => (
    <FormattedMessage id={`${PREFIX}.systemError`} values={values} />
  ),
  NO_ACCOUNTS_ERROR: <FormattedMessage id={`${PREFIX}.noAccountsError`} />,
};

export class BankLoginForm extends Component {
  static propTypes = {
    bank: PropTypes.object.isRequired,
    isLinking: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
  };
  // Prevents possible undefined
  // as navigator renders all the view even when not displayed
  static defaultProps = {
    bank: {},
  };

  render() {
    const {
      bank: { name, notes, usernameText, passwordText },
      errorStatus,
      handleSubmit,
      onCancel,
      isLinking,
      breakpoints,
    } = this.props;

    const username = usernameText || 'Username';
    const password = passwordText || 'Password';

    let nameKey;
    for (var bankName in bankLinkNames) {
      if (name.includes(bankName)) {
        nameKey = bankLinkNames[bankName];
        break;
      }
    }

    const color = bankColorNames[bankName] || 'primary';

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={styles.get(
          ['Container', 'ModalMax', 'LgBottomSpace'],
          breakpoints.current,
        )}
      >
        <ScrollView
          contentContainerStyle={styles.get(['Margins'], breakpoints.current)}
        >
          <LoginHeader
            name={name}
            notes={notes}
            error={!!errorStatus && COPY[errorStatus]}
            nameKey={nameKey}
            color={color}
            breakpoints={breakpoints}
            onBack={onCancel}
          />
          {isLinking ? (
            <View
              style={styles.get([
                'CenterColumn',
                'Flex1',
                'LgTopSpace',
                'LgBottomSpace',
              ])}
            >
              <Spinner large />
            </View>
          ) : (
            <View style={styles.get(['TopGutter'])}>
              {!!Platform.OS === 'web' && <FakePasswordInput />}
              <Field
                name="username"
                component={ReduxInput}
                label={username}
                onSubmit={handleSubmit}
                autoComplete="off"
              />

              <Field
                name="password"
                component={ReduxInput}
                type="password"
                label={password}
                onSubmit={handleSubmit}
                autoComplete="new-password"
              />
            </View>
          )}
          <View>
            <Text
              style={styles.get(
                ['FinePrint', 'SubtleText', 'BottomGutter'],
                breakpoints.current,
              )}
            >
              {COPY['agreement']}
            </Text>
            <Text
              style={styles.get(
                ['FinePrint', 'SubtleText', 'BottomGutter'],
                breakpoints.current,
              )}
            >
              {COPY['disclosure']}
            </Text>
          </View>
        </ScrollView>
        <View
          style={styles.get(
            ['BottomBar', 'Margins', 'ContainerRow'],
            breakpoints.current,
          )}
        >
          <View style={styles.get('CenterRightRow')}>
            <Button
              viewport={breakpoints.current}
              disabled={isLinking}
              onClick={handleSubmit}
              wide={breakpoints.select({ PhoneOnly: true })}
            >
              {COPY['button']}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const withReduxForm = reduxForm({
  form: 'BankLoginForm',
  validate: createValidator(bankLinkForm),
  destroyOnUnmount: false,
});

const enhance = compose(
  withReduxForm,
  withDimensions,
);

export default enhance(BankLoginForm);
