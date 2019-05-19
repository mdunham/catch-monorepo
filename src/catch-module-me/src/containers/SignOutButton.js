import React from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Text, Link, Box } from '@catch/rio-ui-kit';
import { authActions } from '@catch/login';

const PREFIX = 'catch.module.me.SignOutButton';

const SignOutButton = ({ signOut }) => (
  <Box my={5} my={3}>
    <Link onClick={() => signOut()} to="#">
      <Text color="coral-1">
        <FormattedMessage id={`${PREFIX}`} />
      </Text>
    </Link>
  </Box>
);

export default connect(
  undefined,
  { signOut: authActions.signOut },
)(SignOutButton);
