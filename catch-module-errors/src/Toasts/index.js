import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { DAEMON, injectSaga } from '@catch/utils';
import * as sel from './selectors';
import saga from './saga';
import { NAME, actions } from './duck';
import { Toast } from './components';
import { Box, zIndex, withDimensions } from '@catch/rio-ui-kit';

const styles = {
  baseContainer: {
    bottom: 60,
    maxWidth: 350,
    ...Platform.select({
      web: {
        position: 'fixed',
      },
      default: {
        position: 'absolute',
      },
    }),
    zIndex: zIndex.toast,
  },
  TabletLandscapeUpContainer: {
    left: 0,
    right: 0,
    marginLeft: 'auto',
    padding: 16,
  },
  TabletPortraitUpContainer: {
    left: 0,
    right: 0,
    marginLeft: 'auto',
    padding: 16,
  },
  PhoneOnlyContainer: {
    right: 8,
  },
  // prevents unnecessary padding at the bottom of the page
  empty: {
    padding: 0,
  },
};

class ToastContainer extends Component {
  static propTypes = {
    toasts: PropTypes.array.isRequired,
    toastHidden: PropTypes.func.isRequired,
  };

  render() {
    const { toasts, toastHidden, viewport } = this.props;
    const isEmpty = !!toasts && toasts.length === 0;
    return (
      <Box
        id="toast-container"
        style={[
          styles.baseContainer,
          styles[`${viewport}Container`],
          isEmpty && styles.empty,
        ]}
      >
        {toasts.map(toast => (
          <Box key={toast.id}>
            <Toast type={toast.type} title={toast.title} msg={toast.msg} />
          </Box>
        ))}
      </Box>
    );
  }
}

const withConnect = connect(
  createStructuredSelector({
    toasts: sel.getToasts,
  }),
  { toastHidden: actions.toastHidden },
);
const withSaga = injectSaga({ key: NAME, saga, mode: DAEMON });

const enhance = compose(
  withSaga,
  withConnect,
  withDimensions,
);

export default enhance(ToastContainer);
