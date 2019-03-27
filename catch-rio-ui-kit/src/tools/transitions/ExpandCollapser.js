import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing } from 'react-native';

import Fader from './Fader';
/**
 * Simple transition animations based on
 * https://medium.com/google-design/motion-design-doesnt-have-to-be-hard-33089196e6c2
 */
class ExpandCollapser extends React.Component {
  static propTypes = {
    durationIn: PropTypes.number,
    durationOut: PropTypes.number,
    height: PropTypes.number,
    isOpen: PropTypes.bool,
    onExpanded: PropTypes.func,
    onCollapsed: PropTypes.func,
  };
  static defaultProps = {
    durationIn: 300,
    durationOut: 300,
  };
  state = {
    height: new Animated.Value(0),
  };
  componentDidUpdate(prevProps) {
    if (prevProps.isOpen !== this.props.isOpen) {
      if (this.props.isOpen) {
        this.handleExpand();
      } else {
        this.handleCollapse();
      }
    }
  }
  handleExpand = () => {
    Animated.timing(this.state.height, {
      toValue: this.props.height,
      easing: Easing.ease,
      duration: this.props.durationIn,
    }).start(this.props.onExpanded);
  };
  handleCollapse = () => {
    Animated.timing(this.state.height, {
      toValue: 0,
      easing: Easing.ease,
      duration: this.props.durationOut,
    }).start(this.props.onCollapsed);
  };
  render() {
    const { children, isOpen } = this.props;
    return (
      <Animated.View
        style={{
          height: this.state.height,
          overflow: 'hidden',
        }}
      >
        <Fader show={isOpen} delayIn={100}>
          {children}
        </Fader>
      </Animated.View>
    );
  }
}

export default ExpandCollapser;
