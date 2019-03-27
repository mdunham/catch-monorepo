import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';

import { styles as st, Icon, colors } from '@catch/rio-ui-kit';

function measureHeight(items, titles, footer) {
  let height = 74;
  if (items[0].length) {
    height += items[0].length * 56;
  }
  if (items[1].length) {
    height += items[1].length * 56 + 48;
  }
  if (items[1].length && items[0].length) {
    height += 48;
  }
  if (items[2].length) {
    height += items[2].length * 56 + 48 + 48;
  }
  if (footer) {
    height += 80;
  }
  // Add a bottom margin
  height += 48;
  return height;
}

class HealthPlanSection extends React.PureComponent {
  static defaultProps = {
    items: [],
    titles: [],
  };
  constructor(props) {
    super(props);
    this.state = {
      sectionHeight: new Animated.Value(74),
      sectionIconRotation: new Animated.Value(0),
      sectionContentOpacity: new Animated.Value(0),
    };
  }
  componentDidUpdate(prevProps) {
    const { activeSection, onOpen } = this.props;
    if (activeSection !== prevProps.activeSection) {
      this.handleSection(activeSection);
    }
  }
  handleSection = idx => {
    const { activeSection, index, onOpen, items, titles, footer } = this.props;
    if (activeSection === null || activeSection !== index) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.sectionHeight, {
            toValue: 74,
            duration: 200,
            easing: Easing.ease,
          }),
          Animated.timing(this.state.sectionIconRotation, {
            toValue: 0,
            duration: 100,
            easing: Easing.ease,
          }),
        ]),
        Animated.timing(this.state.sectionContentOpacity, {
          toValue: 0,
          duration: 100,
          easing: Easing.ease,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(this.state.sectionHeight, {
            toValue: measureHeight(items, titles, footer),
            duration: 200,
            easing: Easing.ease,
          }),
          Animated.timing(this.state.sectionIconRotation, {
            toValue: 90,
            duration: 100,
            easing: Easing.ease,
          }),
        ]),
        Animated.timing(this.state.sectionContentOpacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
        }),
      ]).start(onOpen);
    }
  };
  render() {
    const {
      viewport,
      label,
      onSelect,
      onOpen,
      items,
      index,
      footer,
      titles,
    } = this.props;

    // Only display the first title if there is a second subsection
    const displayTitle1 = !!titles[0] && !!items[1].length;
    // Only display the first divider if there is a first subsection AND
    // a second subsection
    const displayDivider1 = !!items[0].length && !!items[1].length;
    // Only display the second title if there is a third subsection
    const displayTitle2 = !!titles[1] && !!items[2].length;
    // Only display the second divider if there is a second subsection AND
    // a third subsection
    const displayDivider2 = !!items[1].length && !!items[2].length;

    return (
      <Animated.View
        style={[styles.container, { height: this.state.sectionHeight }]}
      >
        <View
          onStartShouldSetResponder={() => true}
          onResponderRelease={onSelect}
          accessibilityRole={Platform.select({
            web: 'button',
          })}
          style={[styles.button, styles[`button${viewport}`]]}
        >
          <Animated.View
            style={{
              transform: [
                {
                  rotate: this.state.sectionIconRotation.interpolate({
                    inputRange: [0, 360],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            }}
          >
            <Icon
              name="right"
              size={12}
              fill={colors['ink+2']}
              dynamicRules={{ paths: { fill: colors['ink+2'] } }}
            />
          </Animated.View>
          <Text style={st.get(['H4', 'Medium', 'LeftGutter'], viewport)}>
            {label}
          </Text>
        </View>
        <Animated.View
          style={[
            styles.contentContainer,
            styles[`contentContainer${viewport}`],
            { opacity: this.state.sectionContentOpacity },
          ]}
        >
          {items[0].map((item, i) => (
            <View
              style={[
                styles.row,
                i !== items[0].length - 1 && styles.thinDivider,
              ]}
              key={`${i}-section`}
            >
              <Text style={st.get('Body', viewport)}>{item.label}</Text>
              <Text style={st.get(['Body', 'Medium'], viewport)}>
                {item.value}
              </Text>
            </View>
          ))}
          {displayDivider1 && <View style={styles.thickDivider} />}
          {displayTitle1 && (
            <Text
              style={st.get(
                ['Body', !!items[0].length && 'XlTopGutter', 'BottomGutter'],
                viewport,
              )}
            >
              {titles[0]}
            </Text>
          )}
          {items[1].map((item, i) => (
            <View
              style={[
                styles.row,
                i !== items[1].length - 1 && styles.thinDivider,
              ]}
              key={`${i}-section`}
            >
              <Text style={st.get('Body', viewport)}>{item.label}</Text>
              <Text style={st.get(['Body', 'Medium'], viewport)}>
                {item.value}
              </Text>
            </View>
          ))}
          {displayDivider2 && <View style={styles.thickDivider} />}
          {displayTitle2 && (
            <Text
              style={st.get(['Body', 'BottomGutter', 'XlTopGutter'], viewport)}
            >
              {titles[1]}
            </Text>
          )}
          {items[2].map((item, i) => (
            <View
              style={[
                styles.row,
                i !== items[2].length - 1 && styles.thinDivider,
              ]}
              key={`${i}-section`}
            >
              <Text style={st.get('Body', viewport)}>{item.label}</Text>
              <Text style={st.get(['Body', 'Medium'], viewport)}>
                {item.value}
              </Text>
            </View>
          ))}
          {!!footer && (
            <Text style={st.get(['Body', 'LgTopGutter'], viewport)}>
              {footer}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  contentContainer: {
    paddingLeft: 40,
    paddingBottom: 40,
    maxWidth: 480,
  },
  contentContainerPhoneOnly: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 37, 51, 0.08)',
  },
  buttonPhoneOnly: {
    paddingLeft: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  thinDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 37, 51, 0.08)',
  },
  thickDivider: {
    borderBottomWidth: 2,
    borderBottomColor: colors['sage+1'],
    paddingBottom: 16,
  },
});

export default HealthPlanSection;
