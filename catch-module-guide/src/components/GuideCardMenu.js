import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  Dot,
  withHover,
  Hoverable,
  styles as st,
  colors,
  ActionSheet,
} from '@catch/rio-ui-kit';
import { ctas } from '../copy';

const PREFIX = 'catch.guide.CardMenu';
export const COPY = {
  startAction: values => (
    <FormattedMessage id={`${PREFIX}.startAction`} values={values} />
  ),
  setupAction: values => (
    <FormattedMessage id={`${PREFIX}.setupAction`} values={values} />
  ),
  dismissAction: <FormattedMessage id={`${PREFIX}.dismissAction`} />,
  addAction: <FormattedMessage id={`${PREFIX}.addAction`} />,
  coveredOnAction: <FormattedMessage id={`${PREFIX}.coveredOnAction`} />,
  coveredOffAction: values => (
    <FormattedMessage id={`${PREFIX}.coveredOffAction`} values={values} />
  ),
  // @NOTE: we are not using it at the moment... TBD if we do
  notifyMeAction: values => (
    <FormattedMessage id={`${PREFIX}.notifyMeAction`} values={values} />
  ),
};

const actions = {
  'COVERED.a1': COPY['setupAction'],
  'COVERED.a2': COPY['coveredOffAction'],
  'CONSIDER.a1': COPY['startAction'],
  'CONSIDER.a2': COPY['addAction'],
  'CONSIDER.a3': COPY['coveredOnAction'],
  'IMPORTANT.a1': COPY['startAction'],
  'IMPORTANT.a2': COPY['dismissAction'],
  'IMPORTANT.a3': COPY['coveredOnAction'],
  'VITAL.a1': COPY['startAction'],
  'VITAL.a2': COPY['dismissAction'],
  'VITAL.a3': COPY['coveredOnAction'],
  'NONE.a1': COPY['startAction'],
  'NONE.a2': COPY['addAction'],
  'NONE.a3': COPY['coveredOnAction'],
};

export function toggleRecommendation(status, original) {
  if (status === 'IMPORTANT' || status === 'VITAL') {
    if (original === 'CONSIDER') {
      return 'CONSIDER';
    }
    return 'NONE';
  }
  // @HACK: We actually need an extra `INTERESTED` flag
  // while we wait for it we bump the cards up by using the
  // IMPORTANT flag for now
  if (status === 'NONE' && original === 'NONE') {
    return 'IMPORTANT';
  }
  if (status === 'CONSIDER') {
    return 'IMPORTANT';
  }
  return original;
}

export function toggleCoverage(status, original) {
  if (status === 'COVERED') {
    if (original === 'NONE' || original === 'CONSIDER') {
      return 'IMPORTANT';
    }
    return original;
  }
  return 'COVERED';
}

export function computeHeight(status, comingSoon) {
  let height = Platform.select({ web: 76, default: 116 });
  const increment = Platform.select({ web: 40, default: 50 });
  if (actions[`${status}.a1`] && !comingSoon) {
    height += increment;
  }
  if (actions[`${status}.a2`]) {
    height += increment;
  }
  if (actions[`${status}.a3`]) {
    height += increment;
  }
  return height;
}

export function showBottomBorder(action, status, platform = Platform.OS) {
  if (platform === 'web') return false;
  switch (action) {
    case 'a1':
      return !!actions[`${status}.a2`] || !!actions[`${status}.a3`];
    case 'a2':
      return !!actions[`${status}.a3`];
    case 'a3':
      return false;
    default:
      return false;
  }
}

/**
 * ====================== GuideCardMenu ======================================
 * The GuideCardMenu handles all the user manual overrides of recommendations
 * as well as changing them back.
 * =============================================================================
 * Currently on top of navigating to the plan page there are 2 types of actions
 * available: (the logic is implemented above, check the tests for more details)
 *
 * - _toggleRecommendation_:
 * 1) If a vertical is not recommended a user can add it to their recommendation section,
 * in that case the `importance` field is set to `IMPORTANT`. However, the card will not show
 * a flag as it is a manual override. It knows that by comparing `importance` with `needBasedImportance`
 * 2) If a vertical is recommended a user can dismiss that recommendation, it will go to the lower section.
 * In that case we set the importance as `NONE`. No flag will display.
 * 3) If a vertical was recommended but dismissed and a user wants to add it back, we reset the recommendation
 * to their original recommendation by mutating the `importance` with the `needBasedImportance` value.
 *
 * - _toggleCoverage_:
 * 1) If a vertical is recommended, a user can manually declare they are covered outside of Catch. In that case,
 * we set the `importance` as `COVERED`. The flag will update to reflect the coverage instead of the recommendation.
 * 2) If a vertical is marked as externally covered, a user can declare they are not covered anymore and may need coverage
 * in that case we want to maintain that vertical in the top section so we set it as `IMPORTANT`
 */
export class GuideCardMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuHeight: new Animated.Value(0),
      bgOpacity: new Animated.Value(0),
      contentOpacity: new Animated.Value(0),
      isOpen: false,
    };
  }
  toggleMobileMenu = Platform.select({
    // We handle the animation here
    web: () => {
      const { status, comingSoon } = this.props;
      const { isOpen } = this.state;
      if (isOpen) {
        Animated.sequence([
          Animated.timing(this.state.contentOpacity, {
            toValue: 0,
            duration: 100,
            easing: Easing.ease,
          }),
          Animated.parallel([
            Animated.timing(this.state.menuHeight, {
              toValue: 0,
              duration: 100,
              easing: Easing.ease,
            }),
            Animated.timing(this.state.bgOpacity, {
              toValue: 0,
              duration: 200,
              easing: Easing.ease,
            }),
          ]),
        ]).start(() => this.setState({ isOpen: false }));
      } else {
        this.setState(
          {
            isOpen: true,
          },
          () => {
            Animated.sequence([
              Animated.parallel([
                Animated.timing(this.state.menuHeight, {
                  toValue: computeHeight(status, comingSoon),
                  duration: 100,
                  easing: Easing.out(Easing.ease),
                }),
                Animated.timing(this.state.bgOpacity, {
                  toValue: 1,
                  duration: 200,
                  easing: Easing.ease,
                }),
              ]),
              Animated.timing(this.state.contentOpacity, {
                toValue: 1,
                duration: 100,
                easing: Easing.ease,
              }),
            ]).start();
          },
        );
      }
    },
    // native, ModalBox has its own animation system
    default: () => this.setState({ isOpen: !this.state.isOpen }),
  });
  handleAction = cb => {
    const { viewport } = this.props;
    return () => {
      if (viewport === 'PhoneOnly') {
        this.toggleMobileMenu();
      } else {
        this.props.toggleHover();
      }
      cb();
    };
  };
  renderMenu = () => {
    const {
      planName,
      viewport,
      onChange,
      onStart,
      id,
      status,
      comingSoon,
      disabled,
      planType,
      needBasedImportance,
    } = this.props;
    const isHealth = planType === 'PLANTYPE_HEALTH';
    return (
      <View style={styles.actionSheetContainer}>
        {Platform.OS !== 'web' && (
          <Text
            style={st.get(
              ['Body', 'Medium', 'SubtleText', 'BottomGutter'],
              viewport,
            )}
          >
            {planName}
          </Text>
        )}
        {actions[`${status}.a1`] &&
          !comingSoon &&
          !disabled && (
            <Hoverable>
              {hovered => (
                <TouchableOpacity
                  style={st.get([showBottomBorder('a1', status) && 'Divider'])}
                  onPress={this.handleAction(onStart)}
                >
                  <Text
                    accessibilityLabel="Card menu action"
                    style={st.get(
                      [
                        'BodyLink',
                        'Medium',
                        styles.actions,
                        hovered && styles.actionsHovered,
                      ],
                      viewport,
                    )}
                  >
                    {isHealth
                      ? ctas.healthExplorer
                      : actions[`${status}.a1`]({ title: planName })}
                  </Text>
                </TouchableOpacity>
              )}
            </Hoverable>
          )}
        {actions[`${status}.a2`] && (
          <Hoverable>
            {hovered => (
              <TouchableOpacity
                style={st.get([showBottomBorder('a2', status) && 'Divider'])}
                onPress={this.handleAction(() =>
                  onChange({
                    variables: {
                      importanceInput: {
                        recommendationID: id,
                        importance:
                          status === 'COVERED'
                            ? toggleCoverage(status, needBasedImportance)
                            : toggleRecommendation(status, needBasedImportance),
                      },
                    },
                  }),
                )}
              >
                <Text
                  accessibilityLabel="Card menu action"
                  style={st.get(
                    [
                      'BodyLink',
                      'Medium',
                      styles.actions,
                      hovered && styles.actionsHovered,
                    ],
                    viewport,
                  )}
                >
                  {typeof actions[`${status}.a2`] === 'function'
                    ? actions[`${status}.a2`]({ title: planName })
                    : actions[`${status}.a2`]}
                </Text>
              </TouchableOpacity>
            )}
          </Hoverable>
        )}
        {actions[`${status}.a3`] && (
          <Hoverable>
            {hovered => (
              <TouchableOpacity
                style={st.get([showBottomBorder('a3', status) && 'Divider'])}
                onPress={this.handleAction(() =>
                  onChange({
                    variables: {
                      importanceInput: {
                        recommendationID: id,
                        importance: toggleCoverage(status, needBasedImportance),
                      },
                    },
                  }),
                )}
              >
                <Text
                  accessibilityLabel="Card menu action"
                  style={st.get(
                    [
                      'BodyLink',
                      'Medium',
                      styles.actions,
                      hovered && styles.actionsHovered,
                    ],
                    viewport,
                  )}
                >
                  {actions[`${status}.a3`]}
                </Text>
              </TouchableOpacity>
            )}
          </Hoverable>
        )}
      </View>
    );
  };
  render() {
    const { isHovered, viewport, status, comingSoon } = this.props;
    const isDesktop = viewport === 'TabletLandscapeUp';
    return (
      <React.Fragment>
        <View style={styles.container}>
          <TouchableOpacity
            accessibilityLabel="Card menu hover or touch"
            disabled={isDesktop}
            style={st.get([
              'CenterColumn',
              styles.dots,
              isHovered && styles.dotsHovered,
            ])}
            hitSlop={{ top: 20, left: 20, bottom: 20, right: 30 }}
            onPress={this.toggleMobileMenu}
          >
            <Dot color="subtle" size={4} m={1.5} />
            <Dot color="subtle" size={4} m={1.5} />
            <Dot color="subtle" size={4} m={1.5} />
          </TouchableOpacity>
        </View>
        {isHovered && (
          <View style={styles.actionsContainer}>{this.renderMenu()}</View>
        )}
        {Platform.select({
          web: this.state.isOpen && (
            <React.Fragment>
              <Animated.View
                style={[
                  styles.overflowContainer,
                  { height: this.state.menuHeight },
                ]}
              >
                <Animated.View style={{ opacity: this.state.contentOpacity }}>
                  <TouchableOpacity
                    onPress={this.toggleMobileMenu}
                    style={styles.dismissAction}
                  >
                    <Icon name="close" fill={colors['ink+2']} size={28} />
                  </TouchableOpacity>
                  {this.renderMenu()}
                </Animated.View>
              </Animated.View>
              <Animated.View
                style={[
                  styles.overflowBackground,
                  { opacity: this.state.bgOpacity },
                ]}
              />
            </React.Fragment>
          ),
          default: (
            <ActionSheet
              display={this.state.isOpen}
              onRequestClose={() => this.setState({ isOpen: false })}
              height={computeHeight(status, comingSoon)}
            >
              <View style={st.get(['LgTopGutter'])}>{this.renderMenu()}</View>
            </ActionSheet>
          ),
        })}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -24,
    right: -24,
  },
  overflowContainer: {
    position: 'absolute',
    top: -24,
    right: -24,
    left: -24,
    backgroundColor: 'white',
    zIndex: 500,
    paddingBottom: 24,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  overflowBackground: {
    position: 'absolute',
    top: -24,
    right: -24,
    left: -24,
    zIndex: 400,
    backgroundColor: 'rgba(31,37,51,0.5)',
    height: 400,
  },
  dots: {
    padding: 24,
  },
  dotsHovered: {
    backgroundColor: colors['ink+4'],
  },
  actions: {
    paddingVertical: Platform.select({
      web: 8,
      default: 16,
    }),
    // Padding is necessary for web hover state
    paddingHorizontal: Platform.select({
      web: 24,
      default: 0,
    }),
  },
  actionsHovered: {
    backgroundColor: colors['ink+4'],
  },
  actionsContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 24,
    right: 0,
    paddingTop: 16,
    paddingBottom: 16,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 9,
    borderRadius: 6,
  },
  actionSheetContainer: Platform.select({
    web: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    default: {
      paddingLeft: 16,
      paddingRight: 16,
    },
  }),
  dismissAction: {
    alignItems: 'flex-end',
    paddingRight: 16,
    paddingLeft: 24,
    paddingTop: 16,
  },
});

export default withHover(GuideCardMenu);
