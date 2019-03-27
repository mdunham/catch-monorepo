import React from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Easing,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import {
  Icon,
  styles as st,
  withHover,
  colors,
  ModalBox,
} from '@catch/rio-ui-kit';

import { guideActions, guideSelectors } from '../store';
import { GuideProgressMenu } from '../components';

export function computeHeight(items) {
  if (Array.isArray(items)) {
    if (items.length > 12) {
      return 438;
    } else if (items.length > 8) {
      return 358;
    } else if (items.length > 4) {
      return 278;
    }
  }
  return 198;
}

export function getShieldState(coveredCount, recCount, hasUpdates) {
  if (hasUpdates) {
    return 'UPDATES';
  } else if (coveredCount === 0) {
    return 'NO_COVERAGE';
  } else if (coveredCount > 0 && coveredCount < recCount) {
    return 'SOME_COVERAGE';
  } else if (coveredCount === recCount) {
    return 'FULL_COVERAGE';
  }
}

export const shieldMap = {
  NO_COVERAGE: 'shield-default',
  SOME_COVERAGE: 'shield-default',
  FULL_COVERAGE: 'shield-covered',
  UPDATES: 'shield-badge',
};

export class GuideProgress extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      cardWidth: new Animated.Value(76),
      cardHeight: new Animated.Value(76),
      contentOpacity: new Animated.Value(0),
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (props.isHovered) {
      return {
        isOpen: true,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isHovered !== this.props.isHovered) {
      this.handleAnimation();
    }
  }
  handleAnimation = () => {
    const { cardWidth, cardHeight, contentOpacity } = this.state;
    const { items } = this.props;

    if (this.props.isHovered) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(cardWidth, {
            toValue: 375,
            duration: 250,
            easing: Easing.out(Easing.ease),
          }),
          Animated.timing(cardHeight, {
            // compute the height of the card based on the number of items
            toValue: computeHeight(items),
            duration: 250,
            easing: Easing.out(Easing.ease),
          }),
        ]),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
        }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 100,
          easing: Easing.ease,
        }),
        Animated.parallel([
          Animated.timing(cardWidth, {
            toValue: 76,
            duration: 200,
            easing: Easing.ease,
          }),
          Animated.timing(cardHeight, {
            toValue: 76,
            duration: 200,
            easing: Easing.ease,
          }),
        ]),
      ]).start(() => this.setState({ isOpen: false }));
    }
  };
  handleOpen = () => {
    const { recCount, coveredCount, items } = this.props;
    const shieldState = getShieldState(coveredCount, recCount);
    this.props.showGuideProgress({
      shieldState,
      recCount,
      coveredCount,
      items,
    });
  };
  handleActions = action => {
    const { onInfo, onPlanDetails, onUpdates, hideGuideProgress } = this.props;
    switch (action) {
      case 'INFO':
        return item => {
          hideGuideProgress();
          onInfo(item);
        };
      case 'PLAN-DETAILS':
        return path => {
          hideGuideProgress();
          onPlanDetails(path);
        };
      case 'PLAN-UPDATES':
        return updates => {
          hideGuideProgress();
          onUpdates(updates);
        };
      default:
        return hideGuideProgress;
    }
  };
  render() {
    const { cardWidth, cardHeight, contentOpacity, isOpen } = this.state;
    const {
      isHovered,
      viewport,
      coveredCount,
      recCount,
      items,
      onPlanDetails,
      onInfo,
      showProgress,
      hideGuideProgress,
    } = this.props;

    const hasUpdates = items.some(item => item.updates && item.updates.length);

    const shieldState = getShieldState(coveredCount, recCount, hasUpdates);

    const menu = (
      <GuideProgressMenu
        coveredCount={coveredCount}
        recCount={recCount}
        shieldState={shieldState}
        items={items}
        onInfo={this.handleActions('INFO')}
        onUpdates={this.handleActions('PLAN-UPDATES')}
        onPlanDetails={this.handleActions('PLAN-DETAILS')}
        viewport={viewport}
      />
    );

    return (
      <View style={[styles.container, isOpen && styles.card]}>
        <Animated.View
          style={[
            {
              width: cardWidth,
              height: cardHeight,
            },
          ]}
        >
          <Animated.View style={[{ opacity: contentOpacity }]}>
            {menu}
          </Animated.View>
        </Animated.View>
        <TouchableOpacity
          disabled={viewport !== 'PhoneOnly'}
          onPress={this.handleOpen}
          style={[styles.shield, styles[`shield${viewport}`]]}
        >
          <Icon name={shieldMap[shieldState]} size={28} />
        </TouchableOpacity>
        <ModalBox
          entry="top"
          position="top"
          style={{
            height:
              computeHeight(items) + Platform.select({ ios: 106, android: 60 }),
            borderBottomLeftRadius: 9,
            borderBottomRightRadius: 9,
          }}
          isOpen={!!showProgress}
          onClosed={hideGuideProgress}
        >
          <SafeAreaView>
            <View style={styles.nativeContainer}>
              <TouchableOpacity
                onPress={hideGuideProgress}
                style={styles.nativeShield}
              >
                <Icon name={shieldMap[shieldState]} size={28} />
              </TouchableOpacity>
              {menu}
            </View>
          </SafeAreaView>
        </ModalBox>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -32,
    right: -24,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 6,
    overflow: 'hidden',
  },
  card: {
    borderColor: colors['ink+3'],
    shadowColor: 'black',
    shadowOpacity: 0.06,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 9,
    backgroundColor: 'white',
    padding: 32,
  },
  shield: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 24,
    alignItems: 'flex-end',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {},
    }),
  },
  shieldPhoneOnly: {
    paddingTop: 0,
  },
  nativeContainer: {
    padding: 16,
  },
  nativeShield: {
    alignSelf: 'flex-end',
  },
});

const withRedux = connect(
  createStructuredSelector({
    showProgress: guideSelectors.getGuideProgressMenu,
  }),
  guideActions,
);

const enhance = compose(
  withHover,
  withRedux,
);

const Component = enhance(GuideProgress);

Component.displayName = 'GuideProgress';

export default Component;
