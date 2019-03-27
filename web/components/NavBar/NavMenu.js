import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, Link, styles, colors } from '@catch/rio-ui-kit';
import NavLink from '../NavLink';

const menuStyles = StyleSheet.create({
  container: {
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 94,
    width: '100%',
  },
  mainNav: {
    fontSize: 24,
    color: colors.ink,
    opacity: 0.5,
  },
  subNav: {
    fontSize: 18,
    color: colors.ink,
  },
  activeNav: {
    opacity: 1,
  },
});

const isActive = route => pathname => pathname.includes(route);

const NavMenu = ({
  breakpoints,
  pathname,
  handleNav,
  signOut,
  handleFeedback,
}) => (
  <View style={menuStyles.container}>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter'])}>
      <Icon
        name="home"
        fill={pathname === '/' ? colors.ink : colors['ink+2']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(
          [
            'Body',
            menuStyles.mainNav,
            pathname === '/' && menuStyles.activeNav,
          ],
          breakpoints.current,
        )}
        onPress={() => handleNav('/')}
      >
        Home
      </Text>
    </View>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="compass"
        fill={/\/guide/.test(pathname) ? colors.ink : colors['ink+2']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(
          [
            'Body',
            menuStyles.mainNav,
            /\/guide/.test(pathname) && menuStyles.activeNav,
          ],
          breakpoints.current,
        )}
        onPress={() => handleNav('/guide')}
      >
        Guide
      </Text>
    </View>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="plan"
        fill={isActive('/plan')(pathname) ? colors.ink : colors['ink+2']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(
          [
            'Body',
            menuStyles.mainNav,
            isActive('/plan')(pathname) && menuStyles.activeNav,
          ],
          breakpoints.current,
        )}
        onPress={() => handleNav('/plan')}
      >
        Plan
      </Text>
    </View>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="profile"
        fill={isActive('/me')(pathname) ? colors.ink : colors['ink+2']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(
          [
            'Body',
            menuStyles.mainNav,
            isActive('/me')(pathname) && menuStyles.activeNav,
          ],
          breakpoints.current,
        )}
        onPress={() => handleNav('/me')}
      >
        Profile
      </Text>
    </View>
    <View style={styles.get(['Divider', 'BottomGutter', 'TopGutter'])} />
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="lightbulb"
        fill={colors['charcoal--light3']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        onPress={handleFeedback}
        style={styles.get(['Body', menuStyles.subNav], breakpoints.current)}
      >
        Beta feedback
      </Text>
    </View>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="gift"
        fill={colors['charcoal--light3']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(['Body', menuStyles.subNav], breakpoints.current)}
        onPress={() => handleNav('/me/referral')}
      >
        Refer a friend
      </Text>
    </View>
    <View style={styles.get(['CenterLeftRow', 'BottomGutter', 'TopGutter'])}>
      <Icon
        name="logoutArrow"
        fill={colors['charcoal--light3']}
        style={styles.get('LgRightGutter')}
      />
      <Text
        style={styles.get(['Body', menuStyles.subNav], breakpoints.current)}
        onPress={signOut}
      >
        Sign out
      </Text>
    </View>
  </View>
);

export default NavMenu;
