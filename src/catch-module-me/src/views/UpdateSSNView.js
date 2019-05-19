/**
 * UpdateSSNView
 *
 * this view is only available to users who are under kyc review and have
 * KYC_NEEDED or KYC_SSN
 *
 * If a user who doesnt meet this criteria somehow tries to navigate to this route, they are redirect away
 */

import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { formValueSelector } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { KycStatus, SSNField, UpdateSSN } from '@catch/common';
import { Text, Button, withDimensions, Box } from '@catch/rio-ui-kit';
import { goTo, Redirect } from '@catch/utils';
import { toastActions } from '@catch/errors';

import { SettingsGroup, SettingsLayout } from '../components';

export class UpdateSSNView extends React.PureComponent {
  static propTypes = {
    breakpoints: PropTypes.object,
    formValue: PropTypes.string,
    push: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);
  }

  handleSuccess = () => {
    this.goTo('/me/info');
    this.props.popToast({
      title: 'Success',
      msg: 'Thanks for you updating your social security number.',
      type: 'success',
    });
  };

  render() {
    const { breakpoints, formValue } = this.props;

    const canSubmit = formValue && formValue.length >= 11;

    return (
      <KycStatus>
        {({ loading, error, canUpdateSSN }) =>
          loading ? null : canUpdateSSN ? (
            <SettingsLayout breakpoints={breakpoints}>
              <SettingsGroup title="Update Social Security Number">
                <View>
                  <Text mb={3}>Re-enter your social security number below</Text>
                  <SSNField form="UpdateSSNForm" />
                  <UpdateSSN onCompleted={this.handleSuccess}>
                    {({ updateSSN, loading: saving }) => (
                      <Button
                        disabled={!canSubmit || !!saving}
                        onClick={() =>
                          updateSSN({
                            variables: { input: { ssn: formValue } },
                          })
                        }
                      >
                        {saving ? 'Submitting' : 'Submit'}
                      </Button>
                    )}
                  </UpdateSSN>
                </View>
              </SettingsGroup>
            </SettingsLayout>
          ) : (
            <Redirect to={'/me/info'} {...this.props} />
          )
        }
      </KycStatus>
    );
  }
}

const withRedux = connect(
  state => ({
    formValue: formValueSelector('UpdateSSNForm')(state, 'ssn'),
  }),
  toastActions,
);

const enhance = compose(
  withRedux,
  withDimensions,
);

const Component = enhance(UpdateSSNView);
Component.displayName = 'UpdateSSNView';

export default Component;
