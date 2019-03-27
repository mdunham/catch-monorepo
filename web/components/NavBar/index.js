import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Easing,
  Platform,
} from 'react-native';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Env } from '@catch/utils';
import {
  styles,
  withDimensions,
  Icon,
  colors,
  Hoverable,
  Paper,
  Divider,
  fonts,
} from '@catch/rio-ui-kit';
import {
  getIsAuthenticated,
  getIsProcessing,
  getSignupStep,
} from '@catch/login/src/store/selectors';
import { authActions } from '@catch/login';
import { MeView } from '@catch/me/src/views';
import { guideActions, guideSelectors, GuideProgressMenu } from '@catch/guide';
import { createStructuredSelector } from 'reselect';
import NavLink from '../NavLink';
import NavMenu from './NavMenu';
import NavQuery from './NavQuery';
import NavAlert from './NavAlert';

const navBarStyles = StyleSheet.create({
  topBarPlaceholder: {
    height: 54,
    width: '100%',
  },
  topBarPhoneOnly: {
    position: 'absolute',
  },
  mobileOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(31,37,51,0.5)',
    zIndex: 50,
  },
  desktopContainer: {
    maxHeight: 64,
  },
  mobileContainer: {
    maxHeight: 54,
  },
  logo: {
    marginRight: 54,
  },
  menuIconContainer: {
    height: 32,
    width: 32,
    paddingVertical: 10,
    paddingHorizontal: 8.5,
    borderColor: colors.ink,
    borderWidth: 1,
    justifyContent: 'space-between',
    borderRadius: 16,
  },
  menuIconLine: {
    backgroundColor: colors.ink,
    height: 2,
    width: '100%',
    borderRadius: 4,
    transformOrigin: 'left center 0',
  },
  menuLink: {
    fontWeight: '400',
    fontSize: fonts.body,
    marginHorizontal: 0,
    marginVertical: 8,
    opacity: 1,
  },
  avatarContainer: {
    height: 32,
    width: 32,
    borderRadius: 1994,
    borderColor: colors.ink,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    cursor: 'pointer',
  },
  betaTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    color: colors['charcoal--light2'],
    borderColor: colors['charcoal--light5'],
    borderRadius: 4,
    borderStyle: 'solid',
  },
});

export function computeHeight(guideProgressMenu, height) {
  const MOBILE_BAR_SPACE = 102;
  if (guideProgressMenu) {
    const { items } = guideProgressMenu;
    if (Array.isArray(items)) {
      if (items.length > 12) {
        return MOBILE_BAR_SPACE + 438;
      } else if (items.length > 8) {
        return MOBILE_BAR_SPACE + 358;
      } else if (items.length > 4) {
        return MOBILE_BAR_SPACE + 278;
      }
    }
    return MOBILE_BAR_SPACE + 198;
  } else {
    return height;
  }
}

export function renderNavBar(pathname, isSigningUp) {
  if (
    (/auth/.test(pathname) && !isSigningUp) ||
    /health\/plans/.test(pathname)
  ) {
    return false;
  }
  return true;
}

export class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      topLineTranslateX: new Animated.Value(0),
      topLineTranslateY: new Animated.Value(0),
      topLineRotation: new Animated.Value(0),
      bottomLineTranslateX: new Animated.Value(0),
      bottomLineTranslateY: new Animated.Value(0),
      bottomLineRotation: new Animated.Value(0),
      middleLineOpacity: new Animated.Value(1),
      overlayHeight: new Animated.Value(54),
      menuOpacity: new Animated.Value(0),
      overlayOpacity: new Animated.Value(0),
      isOpen: false,
      isTouched: false,
    };
  }
  componentDidMount() {
    window.addEventListener('touchend', this.handleTouchEnd);
  }
  componentWillUnmount() {
    window.removeEventListener('touchend', this.handleTouchEnd);
  }
  componentDidUpdate(prevProps) {
    const { isAuthenticated, guideProgressMenu } = this.props;
    // Resets the mobile nav when a user logs out
    if (prevProps.isAuthenticated && !isAuthenticated && this.state.isOpen) {
      this.handleMenuClick();
    }
    if (!prevProps.guideProgressMenu && guideProgressMenu) {
      this.handleMenuClick();
    }
  }
  // If the touchend event is recorded outside of the
  // floating menu we toggle it back
  handleTouchEnd = ({ changedTouches }) => {
    if (this.hoverMenu && this.hoverMenu.measureInWindow) {
      this.hoverMenu.measureInWindow((x, y, width, height) => {
        const posX = changedTouches[0].clientX;
        const posY = changedTouches[0].clientY;
        if (
          !(posX > x && posX < x + width && posY > y && posY < y + height) &&
          this.state.isTouched
        ) {
          this.setState({
            isTouched: false,
          });
        }
      });
    }
  };
  handleMenuClick = cb => {
    const { isOpen } = this.state;
    const { size, hideGuideProgress, guideProgressMenu } = this.props;
    if (isOpen) {
      Animated.timing(this.state.overlayOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
      }).start();
      Animated.timing(this.state.menuOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
      }).start(() =>
        this.setState(
          {
            isOpen: false,
          },
          () => {
            Animated.parallel([
              Animated.timing(this.state.topLineTranslateX, {
                toValue: 0,
                duration: 100,
                easing: Easing.ease,
                // delay: 300,
              }),
              Animated.timing(this.state.topLineTranslateY, {
                toValue: 0,
                duration: 100,
                easing: Easing.ease,
                // delay: 300,
              }),
              Animated.timing(this.state.topLineRotation, {
                toValue: 0,
                easing: Easing.ease,
                duration: 300,
              }),
              Animated.timing(this.state.bottomLineTranslateX, {
                toValue: 0,
                duration: 100,
                easing: Easing.ease,
                // delay: 300,
              }),
              Animated.timing(this.state.bottomLineTranslateY, {
                toValue: 0,
                duration: 100,
                easing: Easing.ease,
                // delay: 300,
              }),
              Animated.timing(this.state.bottomLineRotation, {
                toValue: 0,
                easing: Easing.ease,
                duration: 300,
              }),
              Animated.timing(this.state.middleLineOpacity, {
                toValue: 1,
                easing: Easing.ease,
                duration: 300,
              }),
              Animated.timing(this.state.overlayHeight, {
                toValue: 54,
                easing: Easing.ease,
                duration: 300,
              }),
            ]).start();
            if (guideProgressMenu) {
              hideGuideProgress();
            }
          },
        ),
      );
    } else {
      Animated.parallel([
        Animated.timing(this.state.topLineTranslateX, {
          toValue: 1.3,
          duration: 0,
        }),
        Animated.timing(this.state.topLineTranslateY, {
          toValue: -2,
          duration: 0,
        }),
        Animated.timing(this.state.topLineRotation, {
          toValue: 45,
          easing: Easing.ease,
          duration: 300,
        }),
        Animated.timing(this.state.bottomLineTranslateX, {
          toValue: 1.3,
          duration: 0,
        }),
        Animated.timing(this.state.bottomLineTranslateY, {
          toValue: 2,
          duration: 0,
        }),
        Animated.timing(this.state.bottomLineRotation, {
          toValue: -45,
          easing: Easing.ease,
          duration: 300,
        }),
        Animated.timing(this.state.middleLineOpacity, {
          toValue: 0,
          easing: Easing.ease,
          duration: 300,
        }),
        Animated.timing(this.state.overlayHeight, {
          toValue: computeHeight(guideProgressMenu, size.window.height),
          easing: Easing.ease,
          duration: 300,
        }),
        Animated.timing(this.state.overlayOpacity, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
        }),
      ]).start(() =>
        this.setState(
          {
            isOpen: true,
          },
          () =>
            Animated.timing(this.state.menuOpacity, {
              toValue: 1,
              duration: 300,
              easing: Easing.ease,
            }).start(),
        ),
      );
    }
  };
  handleNav = path => {
    this.props.push(path);
    if (this.state.isOpen) {
      this.handleMenuClick();
    }
  };
  handleIntercom = () => {
    if (window.Intercom) {
      window.Intercom('show');
    }
    if (this.state.isOpen) {
      this.handleMenuClick();
    }
  };
  handleTouch = () => {
    this.setState({
      isTouched: true,
    });
  };
  shouldShowAlert = (needsBankSync, needsIDV) => {
    const {
      location: { pathname },
    } = this.props;
    if (pathname === '/') {
      return false;
    } else if (
      !needsBankSync &&
      needsIDV &&
      pathname === '/plan/upload-identification'
    ) {
      return false;
    } else {
      return needsBankSync || needsIDV || false;
    }
  };
  handleGuideActions = action => {
    const { push, showGuideInfoModal, loadPlanUpdates } = this.props;
    switch (action) {
      case 'INFO':
        return item => {
          this.handleMenuClick();
          showGuideInfoModal(item);
        };
      case 'PLAN-DETAILS':
        return path => {
          this.handleMenuClick();
          push(`/plan/${path}/overview`);
        };
      case 'PLAN-UPDATES':
        return updates => {
          this.handleMenuClick();
          loadPlanUpdates(updates);
        };
      default:
        return () => {
          this.handleMenuClick();
        };
    }
  };
  render() {
    const {
      size,
      signOut,
      breakpoints,
      viewport,
      location: { pathname },
      isProcessing,
      signupStep,
      isAuthenticated,
      guideProgressMenu,
    } = this.props;
    const { isOpen, isProfile, isTouched } = this.state;
    const isSigningUp =
      (signupStep === 'user-info' && isProcessing) ||
      signupStep === 'user-complete';

    return renderNavBar(pathname, isSigningUp) ? (
      <React.Fragment>
        {guideProgressMenu && (
          <Animated.View
            onStartShouldSetResponder={() => true}
            onResponderRelease={this.handleMenuClick}
            style={[
              navBarStyles.mobileOverlay,
              {
                opacity: this.state.overlayOpacity,
                height: size.window.height,
                width: size.window.width,
              },
            ]}
          />
        )}
        <NavQuery skip={!isAuthenticated}>
          {({
            showMenu,
            needsIDV,
            needsBankSync,
            givenName,
            familyName,
            loading,
          }) => (
            <Animated.View
              style={styles.get(
                [
                  'TopBar',
                  breakpoints.select({
                    'PhoneOnly|TabletPortraitUp': {
                      height: this.state.overlayHeight,
                    },
                  }),
                  navBarStyles[`topBar${viewport}`],
                ],
                breakpoints.current,
              )}
            >
              <View
                style={styles.get(
                  [
                    'ContainerRow',
                    'PageMax',
                    'Margins',
                    breakpoints.select({
                      'PhoneOnly|TabletPortraitUp':
                        navBarStyles.mobileContainer,
                      TabletLandscapeUp: navBarStyles.desktopContainer,
                    }),
                  ],
                  breakpoints.current,
                )}
              >
                <View style={styles.get('CenterLeftRow')}>
                  <Icon
                    name="logo"
                    size={32}
                    style={navBarStyles.logo}
                    onClick={() => this.handleNav('/')}
                  />
                  {showMenu &&
                    breakpoints.select({
                      TabletLandscapeUp: (
                        <React.Fragment>
                          <NavLink to="/" exact>
                            Home
                          </NavLink>
                          <NavLink to="/guide">Guide</NavLink>
                          <NavLink to="/plan">Plan</NavLink>
                        </React.Fragment>
                      ),
                    })}
                </View>
                {showMenu && (
                  <View style={styles.get('CenterRightRow')}>
                    {!Env.isDevLike && (
                      <Text
                        selectable={false}
                        onPress={this.handleIntercom}
                        style={styles.get(
                          ['FinePrint', navBarStyles.betaTag, 'RightGutter'],
                          breakpoints.current,
                        )}
                      >
                        Beta
                      </Text>
                    )}
                    <NavAlert
                      showAlert={this.shouldShowAlert(needsBankSync, needsIDV)}
                      onGo={() => this.props.push('/')}
                    />
                    {!loading &&
                      breakpoints.select({
                        'PhoneOnly|TabletPortraitUp': (
                          <TouchableOpacity onPress={this.handleMenuClick}>
                            <View style={navBarStyles.menuIconContainer}>
                              <Animated.View
                                style={[
                                  navBarStyles.menuIconLine,
                                  {
                                    transform: [
                                      {
                                        rotate: this.state.topLineRotation.interpolate(
                                          {
                                            inputRange: [0, 360],
                                            outputRange: ['0deg', '360deg'],
                                          },
                                        ),
                                      },
                                      {
                                        translateX: this.state
                                          .topLineTranslateX,
                                      },
                                      {
                                        translateY: this.state
                                          .topLineTranslateY,
                                      },
                                    ],
                                  },
                                ]}
                              />
                              <Animated.View
                                style={[
                                  navBarStyles.menuIconLine,
                                  { opacity: this.state.middleLineOpacity },
                                ]}
                              />
                              <Animated.View
                                style={[
                                  navBarStyles.menuIconLine,
                                  {
                                    transform: [
                                      {
                                        rotate: this.state.bottomLineRotation.interpolate(
                                          {
                                            inputRange: [0, 360],
                                            outputRange: ['0deg', '360deg'],
                                          },
                                        ),
                                      },
                                      {
                                        translateX: this.state
                                          .bottomLineTranslateX,
                                      },
                                      {
                                        translateY: this.state
                                          .bottomLineTranslateY,
                                      },
                                    ],
                                  },
                                ]}
                              />
                            </View>
                          </TouchableOpacity>
                        ),
                        TabletLandscapeUp: (
                          <Hoverable>
                            {isHovered => (
                              <View
                                style={navBarStyles.avatarContainer}
                                onTouchEnd={this.handleTouch}
                                ref={el => (this.hoverMenu = el)}
                              >
                                <Text
                                  selectable={false}
                                  style={styles.get(
                                    ['Body', 'Bold', navBarStyles.profileIcon],
                                    breakpoints.current,
                                  )}
                                  onPress={() => this.handleNav('/me')}
                                >
                                  {givenName.charAt(0).toUpperCase()}
                                  {familyName.charAt(0).toUpperCase()}
                                </Text>
                                {(isHovered || isTouched) && (
                                  <Paper
                                    white
                                    p={2}
                                    style={{
                                      position: 'absolute',
                                      right: 0,
                                      top: 32,
                                      minWidth: 180,
                                      minHeight: 80,
                                    }}
                                  >
                                    <NavLink
                                      style={navBarStyles.menuLink}
                                      to="/me"
                                      onClick={
                                        viewport === 'PhoneOnly'
                                          ? this.handleMouseLeave
                                          : null
                                      }
                                    >
                                      View Profile
                                    </NavLink>
                                    <Divider my={2} />
                                    <NavLink
                                      style={navBarStyles.menuLink}
                                      to="/auth"
                                      onClick={signOut}
                                    >
                                      Sign Out
                                    </NavLink>
                                  </Paper>
                                )}
                              </View>
                            )}
                          </Hoverable>
                        ),
                      })}
                  </View>
                )}
              </View>
              {isOpen && (
                <Animated.View
                  style={{
                    flex: 1,
                    width: '100%',
                    opacity: this.state.menuOpacity,
                  }}
                >
                  {guideProgressMenu ? (
                    <View style={styles.get(['LgMargins', 'LgTopGutter'])}>
                      <GuideProgressMenu
                        {...guideProgressMenu}
                        viewport={viewport}
                        onPlanDetails={this.handleGuideActions('PLAN-DETAILS')}
                        onUpdates={this.handleGuideActions('PLAN-UPDATES')}
                        onInfo={this.handleGuideActions('INFO')}
                      />
                    </View>
                  ) : (
                    <NavMenu
                      breakpoints={breakpoints}
                      pathname={pathname}
                      handleProfile={this.handleProfile}
                      handleNav={this.handleNav}
                      handleFeedback={this.handleIntercom}
                      signOut={signOut}
                    />
                  )}
                </Animated.View>
              )}
            </Animated.View>
          )}
        </NavQuery>
        {viewport === 'PhoneOnly' && (
          <View style={navBarStyles.topBarPlaceholder} />
        )}
      </React.Fragment>
    ) : null;
  }
}

const withAuth = connect(
  createStructuredSelector({
    isAuthenticated: getIsAuthenticated,
    isProcessing: getIsProcessing,
    signupStep: getSignupStep,
    guideProgressMenu: guideSelectors.getGuideProgressMenu,
  }),
  {
    signOut: authActions.signOut,
    push,
    hideGuideProgress: guideActions.hideGuideProgress,
    showGuideInfoModal: guideActions.showGuideInfoModal,
    loadPlanUpdates: guideActions.loadPlanUpdates,
  },
);

const enhance = compose(
  withDimensions,
  withAuth,
);

export default enhance(NavBar);
