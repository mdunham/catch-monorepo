import React from 'react';
import PropTypes from 'prop-types';
import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { colors, shadow } from '../../const';

class Item extends React.Component {
  static defaultProps = {
    switchOn: false,
    onPress: () => {},
    containerStyle: {
      width: 28,
      height: 8,
      borderRadius: 18,
      backgroundColor: 'rgb(227,227,227)',
      padding: 0,
    },
    circleStyle: {
      width: 16,
      height: 16,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: colors['ink+1'],
      backgroundColor: 'white',
    },
    backgroundColorOn: colors.algae,
    backgroundColorOff: colors['ink+1'],
    circleColorOff: 'white',
    circleBorderColorOff: colors['ink+1'],
    circleColorOn: 'white',
    circleBorderColorOn: colors.algae,
    duration: 100,
  };

  static propTypes = {
    switchOn: PropTypes.bool,
    onPress: PropTypes.func,
    containerStyle: PropTypes.any,
    circleStyle: PropTypes.any,
    backgroundColorOff: PropTypes.string,
    backgroundColorOn: PropTypes.string,
    circleColorOff: PropTypes.string,
    circleColorOn: PropTypes.string,
    duration: PropTypes.number,

    type: PropTypes.number,

    buttonText: PropTypes.string,
    backTextRight: PropTypes.string,
    backTextLeft: PropTypes.string,

    buttonTextStyle: PropTypes.any,
    textRightStyle: PropTypes.any,
    textLeftStyle: PropTypes.any,

    buttonStyle: PropTypes.any,
    buttonContainerStyle: PropTypes.any,
    rightContainerStyle: PropTypes.any,
    leftContainerStyle: PropTypes.any,
  };

  componentWillReceiveProps(newProps) {
    if (newProps.switchOn != this.props.switchOn) {
      this.runAnimation();
    }
  }

  onPress = () => {
    this.props.onPress();
  };

  getStart = () => {
    return this.props.type === undefined
      ? 0
      : this.props.type === 0
        ? 0
        : this.props.containerStyle.padding * 2;
  };

  runAnimation = () => {
    // this.state.anim.setValue(0);
    const animValue = {
      fromValue: this.props.switchOn ? 1 : 0,
      toValue: this.props.switchOn ? 0 : 1,
      duration: this.props.duration,
    };
    Animated.timing(this.state.animXValue, animValue).start();
    // Animated.timing(this.state.anim, animValue).start(() => this.runAnimation());
  };

  constructor(props) {
    super(props);
    const endPos =
      this.props.containerStyle.width -
      (this.props.circleStyle.width + this.props.containerStyle.padding * 2);

    this.state = {
      circlePosXStart: this.getStart(),
      circlePosXEnd: endPos,
      animXValue: new Animated.Value(this.props.switchOn ? 1 : 0),
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.switchOn !== this.props.switchOn) {
      this.runAnimation();
    }
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={0.5}>
        <Animated.View
          style={[
            styles.container,
            this.props.containerStyle,
            {
              backgroundColor: this.state.animXValue.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  this.props.backgroundColorOff,
                  this.props.backgroundColorOn,
                ],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              this.props.circleStyle,
              {
                backgroundColor: this.state.animXValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    this.props.circleColorOff,
                    this.props.circleColorOn,
                  ],
                }),
                borderColor: this.state.animXValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    this.props.circleBorderColorOff,
                    this.props.circleBorderColorOn,
                  ],
                }),
              },
              {
                transform: [
                  {
                    translateX: this.state.animXValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [
                        this.state.circlePosXStart,
                        this.state.circlePosXEnd,
                      ],
                    }),
                  },
                ],
              },
              this.props.buttonStyle,
            ]}
          />
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Item;
