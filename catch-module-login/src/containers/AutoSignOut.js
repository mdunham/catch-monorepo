import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { mins, Idle } from '@catch/utils';
import { toastActions } from '@catch/errors';
import { actions } from '../store/duck';

const PREFIX = 'catch.module.login.AutoSignOut';
export const COPY = {
  toastTitle: <FormattedMessage id={`${PREFIX}.toastTitle`} />,
  toastBody: <FormattedMessage id={`${PREFIX}.toastBody`} />,
};

// @NOTE: we could be passing these constants in props too...
// Time after which we log the user out
const TIMEOUT = mins(60); // mins(3);
// Time before which we warn them about it
const PRETIMEOUT = mins(1); // mins(1);

export const AutoSignOut = ({ signOut, popToast, hideToasts, userInfo }) => (
  <Idle
    timeout={TIMEOUT}
    preTimeout={PRETIMEOUT}
    onChange={() => signOut(userInfo)}
    onWarn={({ warning }) =>
      warning
        ? popToast({
            msg: COPY['toastBody'],
            title: COPY['toastTitle'],
            autoCloseIn: PRETIMEOUT,
          })
        : hideToasts()
    }
  />
);

AutoSignOut.propTypes = {
  signOut: PropTypes.func.isRequired,
  popToast: PropTypes.func.isRequired,
  hideToasts: PropTypes.func.isRequired,
  userInfo: PropTypes.object.isRequired,
};

export default connect(undefined, {
  ...toastActions,
  signOut: actions.signOut,
})(AutoSignOut);
