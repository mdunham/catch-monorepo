import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

import { Button, colors } from '@catch/rio-ui-kit';

class DetailBottomBar extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      size: {
        window: { width },
      },
    } = this.props;
    this.state = {
      barLeft: new Animated.Value(width / 2),
    };
  }
  componentDidUpdate(prevProps) {
    const { planID } = this.props;
    if (!prevProps.planID && planID) {
      this.handleSlideIn();
    }
  }
  handleSlideIn = () => {
    Animated.timing(this.state.barLeft, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  render() {
    const { buttonText, onSubmit, viewport } = this.props;
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateX: this.state.barLeft }] },
        ]}
      >
        <View style={styles.buttonContainer}>
          <Button viewport={viewport} onClick={onSubmit}>
            {buttonText}
          </Button>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: '50%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors['ink+2'],
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    maxWidth: 480,
    paddingLeft: 40,
    paddingRight: 24,
  },
});

export default DetailBottomBar;
