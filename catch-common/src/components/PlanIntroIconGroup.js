import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';

import { Box, Icon, colors, space, styles as st } from '@catch/rio-ui-kit';

const styles = StyleSheet.create({
  pig: {
    height: 32,
    width: 30,
    marginBottom: space[2],
  },
  bank: {
    height: 29,
    width: 34,
    marginBottom: space[2],
  },
  map: {
    height: 32.37,
    width: 30,
    marginBottom: space[2],
  },
  dottedLine: {
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    borderBottomColor: colors.gray4,
    // width: 32,
    opacity: 0.4,
  },
  lineContainer: {
    width: 32,
    marginTop: 16,
  },
  textMax: {
    maxWidth: 140,
    marginBottom: 12,
  },
  textMaxPhoneOnly: {
    maxWidth: 175,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 44,
  },
  itemPhoneOnly: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
  },
});

class PlanIntroIconGroup extends React.PureComponent {
  static propTypes = {
    copy: PropTypes.object.isRequired,
    hasBankLinked: PropTypes.bool.isRequired,
    planName: PropTypes.string.isRequired,
  };
  static defaultProps = {
    copy: {},
  };
  constructor() {
    super();
    this.state = {
      startFadeAnim: new Animated.Value(0),
      startScaleAnim: new Animated.Value(0.8),
      leftLineAnim: new Animated.Value(0),
      centerFadeAnim: new Animated.Value(0),
      centerScaleAnim: new Animated.Value(0.8),
      rightLineAnim: new Animated.Value(0),
      endFadeAnim: new Animated.Value(0),
      endScaleAnim: new Animated.Value(0.8),
      startColor: colors.gray4,
      centerColor: colors.gray4,
      endColor: colors.gray4,
    };
    this.state.startFadeAnim.addListener(this.handleStart);
    this.state.centerFadeAnim.addListener(this.handleCenter);
    this.state.endFadeAnim.addListener(this.handleEnd);
  }
  componentDidMount() {
    Animated.sequence([
      Animated.timing(this.state.startScaleAnim, {
        toValue: 1,
        duration: 700,
        delay: 500,
      }),
      Animated.timing(this.state.startFadeAnim, {
        toValue: 1,
        duration: 300,
      }),
      Animated.timing(this.state.leftLineAnim, {
        toValue: 32,
        duration: 400,
      }),
      Animated.timing(this.state.centerScaleAnim, {
        toValue: 1,
        duration: 700,
      }),
      Animated.timing(this.state.centerFadeAnim, {
        toValue: 1,
        duration: 300,
      }),
      Animated.timing(this.state.rightLineAnim, {
        toValue: 32,
        duration: 400,
      }),
      Animated.timing(this.state.endScaleAnim, {
        toValue: 1,
        duration: 700,
      }),
      Animated.timing(this.state.endFadeAnim, {
        toValue: 1,
        duration: 300,
      }),
    ]).start();
  }
  handleStart = ({ value }) => {
    const { startColor } = this.state;
    if (value > 0 && startColor !== colors.ink) {
      this.setState({
        startColor: colors.ink,
      });
    }
  };
  handleCenter = ({ value }) => {
    const { centerColor } = this.state;
    if (value > 0 && centerColor !== colors.ink) {
      this.setState({
        centerColor: colors.ink,
      });
    }
  };
  handleEnd = ({ value }) => {
    const { endColor } = this.state;
    if (value > 0 && endColor !== colors.ink) {
      this.setState({
        endColor: colors.ink,
      });
    }
  };
  render() {
    const { copy, hasBankLinked, planName } = this.props;

    const step1Icon = {
      tax: 'map',
      timeoff: 'map',
      retirement: 'map',
      health: 'price-tag',
    };
    const step2Icon = {
      tax: 'planpig',
      timeoff: 'planpig',
      retirement: 'planpig',
      health: 'health-card',
    };
    const lastStepIcon = {
      tax: 'crescent',
      timeoff: 'beach',
      retirement: 'earth',
      health: 'wallet',
    };
    const {
      startFadeAnim,
      startScaleAnim,
      centerFadeAnim,
      centerScaleAnim,
      endFadeAnim,
      endScaleAnim,
      leftLineAnim,
      rightLineAnim,
      startColor,
      centerColor,
      endColor,
    } = this.state;
    const { viewport } = this.props;
    const isWide = viewport !== 'PhoneOnly';
    // @NOTE we hide the dotted line animation in narrow viewport to avoid overcrowding
    return (
      <View style={st.get([isWide && 'Row', 'XlTopGutter'])}>
        {!hasBankLinked && (
          <React.Fragment>
            <View style={[styles.item, styles[`item${viewport}`]]}>
              <Animated.View style={{ transform: [{ scale: startScaleAnim }] }}>
                <Icon
                  name="bank"
                  dynamicRules={{ paths: { fill: startColor } }}
                  fill={startColor}
                  style={styles.bank}
                />
              </Animated.View>
              <Animated.View
                style={[
                  {
                    opacity: startFadeAnim,
                  },
                  styles.textMax,
                  styles[`textMax${viewport}`],
                ]}
              >
                <Text
                  style={st.get(
                    ['FinePrint', isWide ? 'CenterText' : 'LeftGutter'],
                    viewport,
                  )}
                >
                  {copy.bank}
                </Text>
              </Animated.View>
            </View>
            {isWide && (
              <View style={styles.lineContainer}>
                <Animated.View
                  style={[styles.dottedLine, { width: leftLineAnim }]}
                />
              </View>
            )}
          </React.Fragment>
        )}
        <View style={[styles.item, styles[`item${viewport}`]]}>
          <Animated.View
            style={{
              transform: [
                { scale: hasBankLinked ? startScaleAnim : centerScaleAnim },
              ],
            }}
          >
            <Icon
              name={step1Icon[planName]}
              stroke="none"
              fill={hasBankLinked ? startColor : centerColor}
              dynamicRules={{
                paths: { fill: hasBankLinked ? startColor : centerColor },
              }}
              {...(planName === 'health' ? { height: 34, width: 40 } : {})}
              style={styles.map}
            />
          </Animated.View>
          <Animated.View
            style={[
              { opacity: hasBankLinked ? startFadeAnim : centerFadeAnim },
              styles.textMax,
              styles[`textMax${viewport}`],
            ]}
          >
            <Text
              style={st.get(
                ['FinePrint', isWide ? 'CenterText' : 'LeftGutter'],
                viewport,
              )}
            >
              {copy.map}
            </Text>
          </Animated.View>
        </View>
        {isWide && (
          <View style={styles.lineContainer}>
            <Animated.View
              style={[
                styles.dottedLine,
                { width: hasBankLinked ? leftLineAnim : rightLineAnim },
              ]}
            />
          </View>
        )}
        <View style={[styles.item, styles[`item${viewport}`]]}>
          <Animated.View
            style={{
              transform: [
                { scale: hasBankLinked ? centerScaleAnim : endScaleAnim },
              ],
            }}
          >
            <Icon
              name={step2Icon[planName]}
              stroke="none"
              dynamicRules={{
                paths: { fill: hasBankLinked ? centerColor : endColor },
              }}
              fill={hasBankLinked ? centerColor : endColor}
              style={styles.pig}
            />
          </Animated.View>
          <Animated.View
            style={[
              { opacity: hasBankLinked ? centerFadeAnim : endFadeAnim },
              styles.textMax,
              styles[`textMax${viewport}`],
            ]}
          >
            <Text
              style={st.get(
                ['FinePrint', isWide ? 'CenterText' : 'LeftGutter'],
                viewport,
              )}
            >
              {copy.pig}
            </Text>
          </Animated.View>
        </View>
        {hasBankLinked && (
          <React.Fragment>
            {isWide && (
              <View style={styles.lineContainer}>
                <Animated.View
                  style={[styles.dottedLine, { width: rightLineAnim }]}
                />
              </View>
            )}
            <View style={[styles.item, styles[`item${viewport}`]]}>
              <Animated.View style={{ transform: [{ scale: endScaleAnim }] }}>
                <Icon
                  name={lastStepIcon[planName]}
                  fill={endColor}
                  dynamicRules={{ paths: { fill: endColor } }}
                  style={styles.bank}
                />
              </Animated.View>
              <Animated.View
                style={[
                  { opacity: endFadeAnim },
                  styles.textMax,
                  styles[`textMax${viewport}`],
                ]}
              >
                <Text
                  style={st.get(
                    ['FinePrint', isWide ? 'CenterText' : 'LeftGutter'],
                    viewport,
                  )}
                >
                  {copy.last}
                </Text>
              </Animated.View>
            </View>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default PlanIntroIconGroup;
