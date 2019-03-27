import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Platform,
} from 'react-native';
import Env from '../../util/env';

import { colors, borderRadius, zIndex, animations, space } from '../../const';
import { withDimensions } from '../../tools';

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed',
        cursor: 'default',
      },
    }),
    top: 0,
    left: 0,
    backgroundColor: colors.overlay,
    height: '100%',
    width: '100%',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: zIndex.modal,
    ...animations.fade,
  },
  transparentOverlay: {
    backgroundColor: 'transparent',
  },
  modal: {
    ...Platform.select({
      web: {
        ...animations.fadeInUp,
        transformOrigin: 'top',
        overflowY: 'auto',
        minWidth: 400,
      },
    }),
    backgroundColor: colors.white,
    borderRadius: borderRadius.regular,
    maxHeight: '100%',
  },
  fullScreen: {
    borderRadius: 0,
    flex: 1,
    width: '100%',
    minWidth: '100%',
  },
});

class ModalContainer extends React.PureComponent {
  /** Recreate the API from react-modal2*/
  static propTypes = {
    onClose: PropTypes.func.isRequired,

    closeOnEsc: PropTypes.bool,
    closeOnBackdropClick: PropTypes.bool,

    backdropStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),

    modalStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };
  static defaultProps = {
    closeOnEsc: true,
    closeOnBackdropClick: true,
  };

  _isPressed = false;

  componentDidMount() {
    if (!Env.isNative) {
      document.addEventListener('keydown', this.handleDocumentKeydown);
    }
  }
  componentWillUnmount() {
    if (!Env.isNative) {
      document.removeEventListener('keydown', this.handleDocumentKeydown);
    }
  }
  handleDocumentKeydown = event => {
    if (this.props.closeOnEsc && event.keyCode === 27) {
      this.props.onClose();
    }
  };

  /**
   * Use direct manipulation method to see if target is inside modal
   * Not certain yet but it might work in native too!
   */
  handleBackdropClick = ({ target }) => {
    if (this._isPressed) {
      this.modal.measureLayout(target, (x, y, width, height) => {
        if (x > 0 && y > 0 && this.props.closeOnBackdropClick) {
          this.props.onClose();
        }
      });
    }
  };

  handleModalClick = event => {
    event.stopPropagation();
  };

  handleRef = el => {
    this.modal = el;
  };

  render() {
    const { style, viewport, transparent } = this.props;

    const isFullScreen = viewport === 'PhoneOnly';
    return (
      <View
        testID="overlay"
        style={[styles.overlay, transparent && styles.transparentOverlay]}
        onStartShouldSetResponder={() => true}
        onResponderRelease={this.handleBackdropClick}
        onResponderGrant={() => (this._isPressed = true)}
      >
        <View
          ref={this.handleRef}
          onStartShouldSetResponder={() => true}
          onResponderTerminate={() => (this._isPressed = false)}
          testID="modal"
          style={[styles.modal, isFullScreen && styles.fullScreen, style]}
          accessible={true}
        >
          {this.props.children}
        </View>
      </View>
    );
  }
}

export default ModalContainer;
