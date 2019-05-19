import React from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, StyleSheet, Platform } from 'react-native';
import { colors, shadow } from '../../const';

const HANDLE_SIZE = 18;
const TRACK_HEIGHT = 4;

class Slider extends React.PureComponent {
  static propTypes = {
    /** Value of the slider */
    value: PropTypes.number.isRequired,
    /** Change event */
    onChange: PropTypes.func,
    /** Minimum value slider can set */
    min: PropTypes.number.isRequired,
    /** Maximum value slider can set */
    max: PropTypes.number.isRequired,
    /** Interval value can change by */
    step: PropTypes.number,
    /** Fixed slider width */
    width: PropTypes.number,
    /** Track color */
    trackColor: PropTypes.string,
    /** Active track color */
    trackColorActive: PropTypes.string,
  };
  static defaultProps = {
    step: 1,
  };

  panResponder = {};
  sliderHandle = null;

  constructor(props) {
    super(props);
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this.handleMoveShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    });
    this.state = {
      isDragging: false,
      position: 0,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { value, min, max, step } = nextProps;
    var percent = 0;

    if (value <= min) percent = 0;
    else if (value >= max) percent = 1;
    else percent = value / (max - min);

    return {
      position: percent,
    };
  }

  initLayout = ({ nativeEvent: { layout } }) => {
    this.setState({
      width: layout.width,
    });
  };

  normalizeDragPosition = dx => {
    const { width, position, prevPosition } = this.state;

    const dir = dx > 0 ? 1 : -1;
    const posX = (Math.sqrt(Math.pow(dx, 2)) * dir) / width;

    const nextPosition = prevPosition + posX;
    if (nextPosition > 1) return 1;
    else if (nextPosition < 0) return 0;
    else return nextPosition;
  };

  percentToValue = percent => {
    const { min, max, step } = this.props;
    const value = min + percent * (max - min);
    return this.roundValueToStep(value, step);
  };

  roundValueToStep = (value, step) => {
    return Math.round(value / step) * step;
  };

  updateNativeStyles() {
    this.sliderHandle && this.sliderHandle.setNativeProps(this.state);
  }

  handleStartShouldSetPanResponder = (e, gestureState) => {
    return true;
  };

  handleMoveShouldSetPanResponder = (e, gestureState) => {
    return true;
  };

  handlePanResponderGrant = (e, gestureState) => {
    // this.highlight();
    this.setState(prevState => ({
      isDragging: true,
      prevPosition: prevState.position,
    }));
  };

  handlePanResponderMove = (e, gestureState) => {
    // this.handleStyles.style.left = this._previousLeft + gestureState.dx;
    // this.updateNativeStyles();
    const percent = this.normalizeDragPosition(gestureState.dx);
    const value = this.percentToValue(percent);
    this.props.onChange(value);
  };

  handlePanResponderEnd = (e, gestureState) => {
    // this.unHighlight();
    this.setState({
      isDragging: false,
    });
  };

  render() {
    const { position, isDragging } = this.state;

    return (
      <View
        style={styles.base}
        {...this.panResponder.panHandlers}
        onLayout={this.initLayout}
      >
        <View style={styles.track}>
          <View
            style={[
              styles.trackActive,
              { width: `${this.state.position * 100}%` },
            ]}
          />
        </View>
        <View
          style={[
            styles.handle,
            { left: `${this.state.position * 100}%` },
            isDragging && styles.highlight,
          ]}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  base: {
    height: HANDLE_SIZE,
    marginTop: HANDLE_SIZE,
    marginBottom: HANDLE_SIZE,
    width: '100%',
  },
  handle: {
    height: HANDLE_SIZE,
    width: HANDLE_SIZE,
    flexShrink: 0,
    backgroundColor: colors.white,
    position: 'absolute',
    borderRadius: 1994,
    margin: -HANDLE_SIZE / 2 + TRACK_HEIGHT / 2,
    paddingTop: 7,
    borderColor: colors.ink,
    borderWidth: 2,
    ...shadow.sliderHandle,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      defaut: {},
    }),
  },
  handleTrack: {
    position: 'absolute',
    left: HANDLE_SIZE / 2 - TRACK_HEIGHT / 2,
    right: HANDLE_SIZE / 2 - TRACK_HEIGHT / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    width: '100%',
    backgroundColor: colors['ink+1'],
    borderRadius: 99,
    borderRadius: 6,
    overflow: 'hidden',
  },
  trackActive: {
    height: TRACK_HEIGHT,
    width: 50,
    backgroundColor: colors.ink,
  },
  highlight: {
    shadowColor: 'rgba(0, 0, 0, 0.075)',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
});

export default Slider;
