/**
 * CheckSSNView
 *
 * This view is a pop up that shows up on the PlanLegalView if we
 * detect that a user is trying to use a SSN that's already in our system
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { Box, Text, Modal, styles, H3, Button } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

// not elegant but it works, had problems trying to import from @catch/login
import { actions as authActions } from '@catch/login/src/store/duck';

const PREFIX = 'catch.util.views.CheckSSNView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  help: <FormattedMessage id={`${PREFIX}.help`} />,
  review: <FormattedMessage id={`${PREFIX}.review`} />,
  text1: values => <FormattedMessage id={`${PREFIX}.text1`} values={values} />,
  text2: <FormattedMessage id={`${PREFIX}.text2`} />,
  here: <FormattedMessage id={`${PREFIX}.here`} />,
};

export class CheckSSNView extends React.PureComponent {
  handleHelp = () => {
    const URL =
      'https://help.catch.co/getting-started/why-cant-i-have-multiple-accounts';

    if (Env.isNative) {
      Linking.openURL(URL);
    } else {
      window.open(URL);
    }
  };
  render() {
    const { closeModal, signOut } = this.props;

    return (
      <Modal>
        <Box p={4} style={styles.get('ModalMax')}>
          <H3>{COPY['title']}</H3>
          <Box my={3}>
            <Text>
              {COPY['text1']({
                here: (
                  <Text onClick={signOut} color="link" weight="medium">
                    {COPY['here']}
                  </Text>
                ),
              })}
            </Text>

            <Text mt={2}>{COPY['text2']}</Text>
          </Box>
          <Box row justify="flex-end">
            <Box mr={2}>
              <Button onClick={this.handleHelp} tertiary>
                {COPY['help']}
              </Button>
            </Box>

            <Button onClick={closeModal}>{COPY['review']}</Button>
          </Box>
        </Box>
      </Modal>
    );
  }
}

CheckSSNView.propTypes = {
  closeModal: PropTypes.func.isRequired,
  signOut: PropTypes.func.isRequired,
};

const withAuth = connect(
  undefined,
  { signOut: authActions.signOut },
);

export default withAuth(CheckSSNView);
