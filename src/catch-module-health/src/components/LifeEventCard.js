import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  Easing,
  Platform,
} from 'react-native';

import {
  styles as st,
  colors,
  Icon,
  Hoverable,
  Button,
} from '@catch/rio-ui-kit';

const heightMap = Platform.select({
  web: [268, 210, 242, 210, 270],
  default: [268, 210, 258, 210, 290],
});

class LifeEventCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardHeight: new Animated.Value(44),
      listOpacity: new Animated.Value(0),
    };
  }
  componentDidUpdate(prevProps) {
    if (!prevProps.checked && this.props.checked) {
      this.handleAnimationOpen();
    }
    if (prevProps.checked && !this.props.checked) {
      this.handleAnimationClose();
    }
  }
  handleAnimationOpen = () => {
    const { index } = this.props;
    Animated.sequence([
      Animated.timing(this.state.cardHeight, {
        toValue: heightMap[index],
        duration: 200,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(this.state.listOpacity, {
        toValue: 1,
        duration: 150,
        easing: Easing.ease,
      }),
    ]).start();
  };
  handleAnimationClose = () => {
    Animated.sequence([
      Animated.timing(this.state.listOpacity, {
        toValue: 0,
        duration: 150,
        easing: Easing.ease,
      }),
      Animated.timing(this.state.cardHeight, {
        toValue: 44,
        duration: 200,
        easing: Easing.ease,
      }),
    ]).start();
  };
  render() {
    const { cardHeight, listOpacity } = this.state;
    const {
      title,
      list,
      checked,
      viewport,
      onCheck,
      onConfirm,
      confirmText,
    } = this.props;
    return (
      <Hoverable>
        {isHovered => (
          <Animated.View
            accessibilityRole={Platform.select({
              web: 'button',
            })}
            importantForAccessibility="yes"
            accessibilityStates={checked ? ['selected'] : undefined}
            onStartShouldSetResponder={() => true}
            onResponderRelease={onCheck}
            style={[
              styles.container,
              isHovered && styles.containerHovered,
              checked && styles.containerChecked,
              { height: cardHeight },
            ]}
          >
            <View style={styles.titleContainer}>
              <Text style={st.get(['Body', 'Medium'], viewport)}>{title}</Text>
              {checked && (
                <Icon
                  name="check"
                  dynamicRules={{
                    paths: { fill: colors.ink },
                  }}
                  fill={colors.ink}
                  style={{ marginTop: 8 }}
                  size={18}
                />
              )}
            </View>
            <Animated.View
              style={[styles.listContainer, { opacity: listOpacity }]}
            >
              {list.map((p, i) => (
                <Text
                  key={`p-${i}`}
                  style={st.get(
                    ['FinePrint', styles.listItem, i === 0 && 'SmTopGutter'],
                    viewport,
                  )}
                >
                  {p}
                </Text>
              ))}
              <View style={styles.buttonContainer}>
                <Button qaName="Confirm life event" onClick={onConfirm}>
                  {confirmText}
                </Button>
              </View>
            </Animated.View>
          </Animated.View>
        )}
      </Hoverable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors['peach+1'],
    overflow: 'hidden',
    borderRadius: 6,
  },
  containerHovered: {
    backgroundColor: colors.peach,
  },
  containerChecked: {
    backgroundColor: colors['peach-1'],
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    height: 44,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  listItem: {
    marginBottom: 12,
    lineHeight: Platform.select({
      web: 'auto',
      default: 16,
    }),
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default LifeEventCard;
