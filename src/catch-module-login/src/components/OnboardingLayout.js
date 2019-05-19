import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import {
  Box,
  Text,
  Figure,
  Link,
  withDimensions,
  colors,
  space,
  size,
  shadow,
  Fader,
} from '@catch/rio-ui-kit';
import { onboardingSteps as stps } from '../store/duck';
import visibleFigures from './OnboardingFigures';

const isNative = Platform.OS !== 'web';

const styles = StyleSheet.create({
  baseContainer: {
    flexDirection: 'row',
    minHeight: '100%',
    flex: Platform.select({
      web: 1,
      default: 0,
    }),
  },
  PhoneOnlyContainer: {
    flexDirection: 'column',
  },
  TabletPortraitUpContainer: {
    flexDirection: 'column',
  },
  baseLeftColumn: {
    backgroundColor: colors['peach+2'],
    width: 407,
  },
  TabletPortraitUpLeftColumn: Platform.select({
    web: {
      width: '100%',
      order: 2,
    },
    default: {},
  }),
  PhoneOnlyLeftColumn: Platform.select({
    web: {
      width: '100%',
      order: 2,
    },
    default: {},
  }),
  baseRightColumn: {
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: space[2],
  },
  TabletPortraitUpRightColumn: Platform.select({
    web: {
      order: 1,
      padding: space[2],
      minHeight: 620,
    },
    default: {},
  }),
  PhoneOnlyRightColumn: Platform.select({
    web: {
      order: 1,
      minHeight: 620,
      flex: 0,
    },
    default: {},
  }),
  topRight: {
    top: 0,
    right: 0,
  },
  baseNavbar: {
    left: 0,
    top: 0,
    right: 0,
    zIndex: 1,
    height: 96,
  },
  TabletPortraitUpNavbar: {
    height: 60,
  },
  PhoneOnlyNavbar: {
    height: 54,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors['charcoal--light5'],
    backgroundColor: colors.white,
    ...shadow.minor,
  },
  keyboardView: {
    flex: 1,
  },
});

const logoSizes = {
  PhoneOnly: {
    height: 17.87,
    width: 66,
  },
};

const progressSteps = [stps.CONFIRM, stps.CREATE, stps.WORKTYPE, stps.INFO];

export const OnboardingLayout = ({
  isWaitlist,
  step,
  children,
  sidebar,
  viewport,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.select({ ios: 'padding' })}
    style={styles.keyboardView}
  >
    {Platform.OS === 'web' && (
      <Box absolute style={[styles.baseNavbar, styles[`${viewport}Navbar`]]}>
        <Box
          px={[2, 3, 40]}
          w={1}
          py={[2, 2, 4]}
          screen={viewport}
          row
          justify="space-between"
          align="center"
        >
          <Link to="https://catch.co">
            <Figure name="catch-black" {...logoSizes[viewport] || {}} />
          </Link>
          {progressSteps.includes(step) && !isWaitlist ? (
            <Text color="charcoal--light2" weight="medium">
              Step {progressSteps.indexOf(step) + 2} of{' '}
              {progressSteps.length + 1}
            </Text>
          ) : isNative ? (
            <TouchableOpacity>
              <Text color="link" weight="medium">
                Sign in
              </Text>
            </TouchableOpacity>
          ) : (
            <Link to="/auth/sign-in">Sign in</Link>
          )}
        </Box>
      </Box>
    )}
    <ScrollView
      contentContainerStyle={[
        styles.baseContainer,
        styles[`${viewport}Container`],
      ]}
    >
      {Platform.OS === 'web' && (
        <View style={[styles.baseLeftColumn, styles[`${viewport}LeftColumn`]]}>
          <Box
            justify="flex-end"
            flex={1}
            align={viewport === 'TabletPortraitUp' ? 'center' : 'flex-start'}
          >
            {viewport === 'TabletLandscapeUp' && visibleFigures(step)}
            <Box
              flex={1}
              p={[4, null, 4]}
              pl={[2, null, 40]}
              pt={[null, 49, 96]}
              pb={[null, 90, null]}
              style={{ maxWidth: 430 }}
              screen={viewport}
            >
              {step === stps.REGISTER && sidebar}
            </Box>
          </Box>
        </View>
      )}
      <View
        key="main"
        style={[styles.baseRightColumn, styles[`${viewport}RightColumn`]]}
      >
        <Box
          mt={[Platform.select({ web: 85, default: 2 }), 96, 96]}
          mb={5}
          pb={2}
          w={1}
          style={{ maxWidth: 430 }}
          screen={viewport}
        >
          {children(viewport)}
        </Box>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
);

OnboardingLayout.propTypes = {
  size: PropTypes.object,
  step: PropTypes.string,
  children: PropTypes.func,
  sidebar: PropTypes.node,
  isWaitlist: PropTypes.bool,
};

const Component = withDimensions(OnboardingLayout);

Component.displayName = 'OnboardingLayout';

export default Component;
