import React from 'react';
import PropTypes from 'prop-types';
import createHoverMonitor from './HoverMonitor';

const hover = createHoverMonitor();

// clone a function as child to inject a hover state
export default class Hoverable extends React.PureComponent {
  static propTypes = {
    onHoverIn: PropTypes.func,
    onHoverOut: PropTypes.func,
  };
  constructor(props) {
    super(props);
    this.state = { isHovered: false };
    this._handleMouseEnter = this._handleMouseEnter.bind(this);
    this._handleMouseLeave = this._handleMouseLeave.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { isHovered } = this.state;
    const { onUpdate } = this.props;
    if (prevState.isHovered !== isHovered) {
      if (onUpdate) onUpdate(isHovered);
    }
  }

  _handleMouseEnter(e) {
    if (hover.isEnabled && !this.state.isHovered) {
      const { onHoverIn } = this.props;
      if (onHoverIn) onHoverIn();
      this.setState(() => ({ isHovered: true }));
    }
  }

  _handleMouseLeave(e) {
    if (this.state.isHovered) {
      const { onHoverOut } = this.props;
      if (onHoverOut) onHoverOut();
      this.setState(() => ({ isHovered: false }));
    }
  }

  // Used to manually override the hover state
  toggleHover = () => {
    this.setState(({ isHovered }) => ({ isHovered: !isHovered }));
  };

  render() {
    const { children, onHoverIn, onHoverOut } = this.props;
    const child =
      typeof children === 'function'
        ? children(this.state.isHovered, this.toggleHover)
        : children;
    return React.cloneElement(React.Children.only(child), {
      onMouseEnter: this._handleMouseEnter,
      onMouseLeave: this._handleMouseLeave,
    });
  }
}
