import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing } from 'react-native';

/**
 * Basic fade transitioner, the API can be extended based in our needs
 */
class Fader extends React.PureComponent {
  static propTypes = {
    durationIn: PropTypes.number,
    durationOut: PropTypes.number,
    delayIn: PropTypes.number,
    delayOut: PropTypes.number,
    show: PropTypes.bool,
    style: PropTypes.object,
    children: PropTypes.node,
  };
  static defaultProps = {
    durationIn: 300,
    durationOut: 100,
  };
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }
  componentDidMount() {
    if (this.props.show) {
      this.in();
    }
  }
  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (show !== prevProps.show) {
      if (show) {
        this.in();
      } else {
        this.out();
      }
    }
  }
  componentWillUnmount() {
    if (this.props.show) {
      this.out();
    }
  }
  in = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      easing: Easing.ease,
      duration: this.props.durationIn,
      delay: this.props.delayIn,
    }).start();
  };
  out = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      easing: Easing.ease,
      duration: this.props.durationOut,
      delay: this.props.delayOut,
    }).start();
  };
  render() {
    const { style, children, ...other } = this.props;
    return (
      <Animated.View style={[{ opacity: this.state.opacity }, style]}>
        {children}
      </Animated.View>
    );
  }
}

export default Fader;
