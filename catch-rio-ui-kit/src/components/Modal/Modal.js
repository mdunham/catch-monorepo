import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ModalContainer from './ModalContainer';
import Env from 'exenv';
import { zIndex } from '../../const';

// Creates root node to render modals into if it doesnt exist
function createRoot(id = 'rio-modal-root') {
  const node = document.createElement('div');
  node.setAttribute('id', id);
  node.setAttribute('style.z-index', zIndex.modal);
  return node;
}

/**
 * Modal still needs to be developed and documented.
 */
class Modal extends Component {
  constructor(props) {
    super(props);
    if (Env.canUseDOM) {
      this.el = document.createElement('div');
    }
  }

  static propTypes = {
    /** Optional css extension */
    className: PropTypes.string,
    /** The content to be rendered */
    children: PropTypes.node,
    /** @ignore */
    styles: PropTypes.object,
    /** The id of the application root */
    appRootID: PropTypes.string,

    onRequestClose: PropTypes.func,
    closeOnEsc: PropTypes.bool,
    closeOnBackdropClick: PropTypes.bool,
    width: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
      PropTypes.number,
    ]),
  };
  static defaultProps = {
    appRootID: 'app',
    closeOnEsc: true,
    closeOnBackdropClick: true,
    width: '80%',
    onRequestClose: () => {},
  };

  // before mounting, ensure we have a root DOM node to render our portal in
  componentWillMount() {
    // we in a web environment or what??
    if (Env.canUseDOM) {
      this.modalRoot = document.getElementById('rio-modal-root');
      if (!this.modalRoot) {
        this.modalRoot = createRoot();
        document.body.appendChild(this.modalRoot);
      }
    }
  }

  componentDidMount() {
    if (Env.canUseDOM) {
      this.modalRoot.appendChild(this.el);
    }
  }

  // componentWillUnmount() {
  //   if (Env.canUseDOM) {
  //     this.modalRoot.removeChild(this.el);
  //     document.body.removeChild(this.modalRoot);
  //   }
  // }

  render() {
    const {
      closeOnEsc,
      closeOnBackdropClick,
      onRequestClose,
      ...other
    } = this.props;

    return ReactDOM.createPortal(
      <ModalContainer
        key="modal"
        closeOnEsc={closeOnEsc}
        closeOnBackdropClick={closeOnBackdropClick}
        onClose={onRequestClose}
        {...other}
      >
        {this.props.children}
      </ModalContainer>,
      this.el,
    );
  }
}

export default Modal;
