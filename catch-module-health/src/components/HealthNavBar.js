import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

import { styles as st, colors, Icon, Button } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';
import { createFilters, filterPlans } from '../utils';

import HealthFilterGroup from './HealthFilterGroup';
import NetworkFilterCard from './NetworkFilterCard';
import TiersFilterCard from './TiersFilterCard';
import PremiumFilterCard from './PremiumFilterCard';

const cardHeights = {
  network: 316,
  tiers: 328,
  premium: 284,
};

class HealthNavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      cardLeft: new Animated.Value(0),
      cardHeight: new Animated.Value(0),
      cardWidth: new Animated.Value(0),
      contentOpacity: new Animated.Value(0),
      showFilterPage: false,
      openCard: null,
      layouts: {},
    };
  }
  // Necessary to allow the card content to fade out
  // before it is unmounted
  static getDerivedStateFromProps(props, state) {
    if (props.showFilter) {
      return {
        openCard: props.showFilter,
      };
    }
    return null;
  }
  componentDidUpdate(prevProps) {
    const { showFilter } = this.props;
    if (!prevProps.showFilter && showFilter) {
      this.handleAnimationOpen(showFilter);
    } else if (!showFilter && prevProps.showFilter) {
      this.handleAnimationClose();
    } else if (showFilter && prevProps.showFilter) {
      this.handleAnimationSlide(showFilter);
    }
  }
  handleAnimationOpen = filter => {
    const {
      cardHeight,
      cardWidth,
      contentOpacity,
      layouts,
      cardLeft,
    } = this.state;
    Animated.parallel([
      Animated.timing(cardLeft, {
        toValue: layouts[filter] - 24,
        duration: 0,
      }),
      Animated.spring(cardHeight, {
        toValue: cardHeights[filter],
        tension: 70,
        friction: 30,
      }),
      Animated.spring(cardWidth, {
        toValue: 280,
        tension: 70,
        friction: 30,
      }),
      Animated.timing(contentOpacity, {
        delay: 350,
        toValue: 1,
        duration: 50,
        easing: Easing.ease,
      }),
    ]).start();
  };
  handleAnimationSlide = filter => {
    const { layouts, cardLeft, cardHeight } = this.state;
    Animated.parallel([
      Animated.spring(cardLeft, {
        toValue: layouts[filter] - 24,
        tension: 70,
        friction: 30,
      }),
      Animated.spring(cardHeight, {
        toValue: cardHeights[filter],
        tension: 70,
        friction: 30,
      }),
    ]).start();
  };
  handleAnimationClose = () => {
    const { cardHeight, cardWidth, contentOpacity } = this.state;
    Animated.sequence([
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
      }),
      Animated.parallel([
        Animated.spring(cardHeight, {
          toValue: 0,
          tension: 70,
          friction: 40,
        }),
        Animated.spring(cardWidth, {
          toValue: 0,
          tension: 70,
          friction: 40,
        }),
      ]),
    ]).start(() => this.setState({ cardOpen: null }));
  };
  handleLayout = filter => {
    return ({
      nativeEvent: {
        layout: { x, y, width, height },
      },
    }) => {
      // Handle initial rendering
      if (!this.state.layouts[filter]) {
        this.setState(({ layouts }) => ({
          layouts: {
            ...layouts,
            [filter]: x,
          },
        }));
      } else {
        // If the button size changes we need to
        // measure the neighbor container as this one
        // won't trigger onLayout
        switch (filter) {
          case 'network':
            this.tiersRef.measure(x => {
              this.setState(({ layouts }) => ({
                layouts: {
                  ...layouts,
                  tiers: x,
                },
              }));
            });
          case 'tiers':
            this.premiumRef.measure(x => {
              this.setState(({ layouts }) => ({
                layouts: {
                  ...layouts,
                  premium: x,
                },
              }));
            });
        }
      }
    };
  };
  handleFilterPage = () => {
    this.setState({ showFilterPage: !this.state.showFilterPage });
  };
  handleActivateFilters = activeFilters => {
    const { onActivateFilters } = this.props;
    onActivateFilters(activeFilters);
    this.handleFilterPage();
  };
  handleResetFilters = () => {
    const { onActivateFilters } = this.props;
    onActivateFilters(null);
    this.handleFilterPage();
  };
  handleRefs = name => {
    return el => (this[`${name}Ref`] = el);
  };
  render() {
    const {
      viewport,
      goTo,
      plans,
      onBack,
      filters,
      showFilter,
      onActivateFilters,
      onFilterChange,
      onFilterCard,
    } = this.props;

    const filterNames = {
      hmo: 'HMO',
      epo: 'EPO',
      ppo: 'PPO',
      premium: [
        <Currency whole key="f-1">
          {filters['premium']}
        </Currency>,
        ' /mo',
      ],
      catastrophic: 'Catastrophic',
      bronze: 'Bronze',
      silver: 'Silver',
      gold: 'Gold',
      platinum: 'Platinum',
    };

    const activeFilters = createFilters(filters);
    const activeFiltersNum = activeFilters.reduce((acc, f) => {
      if (f && f.length) {
        return (acc += f.length);
      }
      return acc;
    }, 0);

    const { filteredLength, maxPremium, minPremium } = filterPlans(
      plans,
      activeFilters,
      filters,
    );

    const resultNum = activeFilters.length ? filteredLength : plans.length;

    const networkCopy = activeFilters[0]
      ? activeFilters[0].map(af => filterNames[af]).join(', ')
      : 'Network';

    const tiersCopy = activeFilters[1]
      ? activeFilters[1].map(af => filterNames[af]).join(', ')
      : 'Tiers';

    const premiumCopy = activeFilters[2]
      ? activeFilters[2].map(af => filterNames[af])
      : 'Premium';

    const {
      cardHeight,
      cardWidth,
      contentOpacity,
      showFilterPage,
      cardLeft,
      openCard,
    } = this.state;

    const regs = {
      tiers: /catastrophic|bronze|silver|gold|platinum/,
      premium: /premium/,
      network: /hmo|ppo|epo/,
    };
    const showResetButton =
      !!openCard &&
      Object.keys(filters)
        .filter(k => regs[openCard].test(k))
        .some(
          k =>
            k === 'premium' ? filters[k] < maxPremium : filters[k] === true,
        );

    return (
      <React.Fragment>
        {Platform.OS === 'web' && (
          <View style={[styles.navBar]}>
            <View
              style={st.get(['ContainerRow', 'PageMax', 'Margins'], viewport)}
            >
              <View style={st.get('CenterLeftRow')}>
                <Icon
                  name="logo"
                  size={32}
                  onClick={() => goTo('/guide')}
                  fill={colors.ink}
                />
                <Text
                  style={st.get(['Body', 'LgLeftGutter', 'Medium'], viewport)}
                >
                  Health Explorer
                </Text>
              </View>
            </View>
          </View>
        )}
        <SafeAreaView
          forceInset={{ top: 'always', bottom: 'never' }}
          style={[
            styles.filterBar,
            Platform.OS !== 'web' && styles.nativeFilterBar,
          ]}
        >
          {viewport === 'PhoneOnly' ? (
            Platform.select({
              web: (
                <View
                  style={st.get(['ContainerRow', 'CenterColumn', 'SmMargins'])}
                >
                  <TouchableOpacity
                    style={st.get(['Row', 'CenterColumn'])}
                    onPress={this.handleFilterPage}
                  >
                    <Icon name="toggles" size={20} />
                    <Text
                      style={st.get(
                        ['SmLeftGutter', 'Body', 'Medium'],
                        viewport,
                      )}
                    >
                      Filters
                    </Text>
                  </TouchableOpacity>
                </View>
              ),
              default: (
                <View
                  style={st.get([
                    'ContainerRow',
                    'CenterColumn',
                    'CenterRow',
                    'SmMargins',
                  ])}
                >
                  <View style={styles.nativeNavLeft}>
                    <Icon
                      name="left"
                      height={20}
                      width={13}
                      onClick={onBack}
                      dynamicRules={{ paths: { fill: colors.ink } }}
                    />
                  </View>
                  <Text style={st.get(['Body', 'Medium'], viewport)}>
                    Health Explorer
                  </Text>
                  <View style={styles.nativeNavRight}>
                    {!!activeFiltersNum && (
                      <View style={styles.filterNumContainer}>
                        <Text
                          style={st.get(
                            ['FinePrint', 'Medium', 'CenterText'],
                            viewport,
                          )}
                        >
                          {activeFiltersNum}
                        </Text>
                      </View>
                    )}
                    <Icon
                      name="toggles"
                      size={20}
                      onClick={this.handleFilterPage}
                    />
                  </View>
                </View>
              ),
            })
          ) : (
            <View
              style={st.get(
                ['ContainerRow', 'PageMax', 'Margins', 'CenterColumn'],
                viewport,
              )}
            >
              <View
                ref={this.handleRefs('network')}
                onLayout={this.handleLayout('network')}
                style={st.get([
                  'RightGutter',
                  showFilter === 'network' && styles.selectedButton,
                ])}
              >
                <Button
                  small
                  onClick={() =>
                    onFilterCard(showFilter === 'network' ? false : 'network')
                  }
                  type={activeFilters[0] ? 'sage' : 'outline'}
                  viewport={viewport}
                >
                  {networkCopy}
                </Button>
              </View>
              <View
                ref={this.handleRefs('tiers')}
                onLayout={this.handleLayout('tiers')}
                style={st.get([
                  'RightGutter',
                  showFilter === 'tiers' && styles.selectedButton,
                ])}
              >
                <Button
                  small
                  type={activeFilters[1] ? 'sage' : 'outline'}
                  onClick={() =>
                    onFilterCard(showFilter === 'tiers' ? false : 'tiers')
                  }
                  viewport={viewport}
                >
                  {tiersCopy}
                </Button>
              </View>
              <View
                ref={this.handleRefs('premium')}
                onLayout={this.handleLayout('premium')}
                style={[showFilter === 'premium' && styles.selectedButton]}
              >
                <Button
                  small
                  type={activeFilters[2] ? 'sage' : 'outline'}
                  onClick={() =>
                    onFilterCard(showFilter === 'premium' ? false : 'premium')
                  }
                  viewport={viewport}
                >
                  {premiumCopy}
                </Button>
              </View>
              <Animated.View
                style={[
                  styles.filterCard,
                  {
                    height: cardHeight,
                    width: cardWidth,
                    transform: [{ translateX: cardLeft }],
                  },
                ]}
              >
                <Animated.View
                  style={st.get(['Flex1', { opacity: contentOpacity }])}
                >
                  {openCard === 'network' && (
                    <NetworkFilterCard
                      viewport={viewport}
                      onFilterChange={onFilterChange}
                      filters={filters}
                    />
                  )}
                  {openCard === 'tiers' && (
                    <TiersFilterCard
                      viewport={viewport}
                      onFilterChange={onFilterChange}
                      filters={filters}
                    />
                  )}
                  {openCard === 'premium' && (
                    <PremiumFilterCard
                      viewport={viewport}
                      onFilterChange={onFilterChange}
                      maxPremium={maxPremium}
                      minPremium={minPremium}
                      filters={filters}
                    />
                  )}
                  <View style={styles.cardButtonContainer}>
                    {showResetButton && (
                      <Text
                        style={st.get(
                          ['Body', 'Medium', 'RightGutter'],
                          viewport,
                        )}
                        onPress={() => onActivateFilters(null)}
                      >
                        Reset
                      </Text>
                    )}
                    <Button
                      viewport={viewport}
                      small
                      onClick={() => onActivateFilters(activeFilters)}
                    >
                      View {resultNum} plans
                    </Button>
                  </View>
                </Animated.View>
              </Animated.View>
            </View>
          )}
        </SafeAreaView>
        {!!showFilter && (
          <View
            style={styles.overlay}
            onStartShouldSetResponder={() => true}
            onResponderRelease={() => onFilterCard(false)}
          />
        )}
        {showFilterPage && (
          <HealthFilterGroup
            onActivate={() => this.handleActivateFilters(activeFilters)}
            onReset={this.handleResetFilters}
            onFilterChange={onFilterChange}
            onClose={this.handleFilterPage}
            maxPremium={maxPremium}
            minPremium={minPremium}
            resultNum={resultNum}
            viewport={viewport}
            filters={filters}
          />
        )}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    zIndex: 100,
  },
  navBar: {
    height: 64,
    width: '100%',
    backgroundColor: colors['sage+2'],
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors['sage'],
    zIndex: 1000,
  },
  filterBar: {
    height: 58,
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors['sage+2'],
    borderBottomWidth: 1,
    borderBottomColor: colors['sage'],
    zIndex: 1000,
    justifyContent: 'center',
  },
  nativeFilterBar: {
    height: 100,
  },
  nativeNavLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    top: 0,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  nativeNavRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    top: 0,
    paddingRight: 16,
    alignItems: 'center',
    flexDirection: 'row',
  },
  filterNumContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.sage,
    borderRadius: 24,
    marginRight: 8,
  },
  filterCard: {
    backgroundColor: colors['sage+2'],
    borderWidth: 1,
    borderColor: colors['sage'],
    // width: 280,
    position: 'absolute',
    top: 57,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      height: 3,
      width: 3,
    },
    shadowRadius: 9,
  },
  selectedButton: {
    opacity: 0.5,
  },
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
    backgroundColor: '#fff',
    zIndex: 500,
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 24,
    paddingBottom: 24,
  },
});

export default HealthNavBar;
