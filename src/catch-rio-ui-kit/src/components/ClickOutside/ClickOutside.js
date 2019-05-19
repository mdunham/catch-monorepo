import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ClickOutside sneaks a div in the DOM with a ref and checks
 * any click on the document is on an element inside that div.
 */
export default class ClickOutside extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    onClickOutside: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleRef = this.handleRef.bind(this);
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
    this.isTouch = false;
  }

  getContainer(ref) {
    this.container = ref;
  }

  componentDidMount() {
    document.addEventListener('touchend', this.handleDocumentClick, true);
    document.addEventListener('click', this.handleDocumentClick, true);
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleDocumentClick, true);
    document.removeEventListener('click', this.handleDocumentClick, true);
  }

  handleDocumentClick = e => {
    if (e.type === 'touchend') this.isTouch = true;
    if (e.type === 'click' && this.isTouch) return;
    if (this.element) {
      if (this.element.contains && !this.element.contains(e.target)) {
        this.props.onClickOutside(e);
      }
    }
  };

  handleRef(el) {
    const { children } = this.props;
    this.element = el;
    if (children.ref && typeof children.ref === 'function') {
      children.ref(el);
    }
  }

  render() {
    return <div ref={this.handleRef}>{this.props.children}</div>;
  }
}
