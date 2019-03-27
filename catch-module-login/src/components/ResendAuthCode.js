import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { Box, Text, Icon, colors } from '@catch/rio-ui-kit';

import { actions } from '../store/duck';
import * as sel from '../store/selectors';

export const ResendAuthCode = ({
  children,
  successMsg,
  resendEmail,
  resentCode,
  center,
}) => (
  <TouchableOpacity onPress={resendEmail}>
    {resentCode ? (
      <Box row align="center" justify={center ? 'center' : 'flex-start'}>
        <Icon
          name="check"
          dynamicRules={{ paths: { fill: colors.success, opacity: 1 } }}
          fill={colors.success}
          size={16}
        />
        <Text ml={1} weight="medium" size="small" center={center}>
          {successMsg}
        </Text>
      </Box>
    ) : (
      <Text weight="medium" color="link" size="small" center={center}>
        {children}
      </Text>
    )}
  </TouchableOpacity>
);

ResendAuthCode.propTypes = {
  resendEmail: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default connect(
  // state
  createStructuredSelector({
    userContext: sel.getUserContext,
    resentCode: sel.getResentCode,
  }),
  // actions
  {
    resendEmail: actions.resendEmail,
  },
  // better API
  (stateProps, dispatchProps, ownProps) => {
    return {
      ...ownProps,
      ...stateProps,
      resendEmail: () =>
        dispatchProps.resendEmail(stateProps.userContext.email),
    };
  },
)(ResendAuthCode);
