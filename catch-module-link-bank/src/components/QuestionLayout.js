import React from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
} from 'react-native';

import { Button, styles } from '@catch/rio-ui-kit';
import SyncHeader from './SyncHeader';

/**
 * Reusable layout featuring the bank logo or icon at the top,
 * a ScrollView in case content overflows on smaller devices,
 * a button that sticks to the bottom on narrow viewports.
 */
const QuestionLayout = ({
  breakpoints,
  title,
  onSubmit,
  invalid,
  isLoading,
  bankIcon,
  children,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.select({ ios: 'padding' })}
    style={styles.get('Container')}
  >
    <ScrollView
      contentContainerStyle={styles.get(
        ['Margins', 'FullWidth', 'SmBottomSpace'],
        breakpoints.current,
      )}
    >
      <SyncHeader iconName={bankIcon} />
      <Text
        style={styles.get(
          ['H3', 'FullWidth', 'LgTopGutter', 'LgBottomGutter'],
          breakpoints.current,
        )}
      >
        {title}
      </Text>
      {children}
    </ScrollView>
    <View
      style={styles.get(
        ['BottomBar', 'Margins', 'ContainerRow'],
        breakpoints.current,
      )}
    >
      <View style={styles.get('CenterRightRow')}>
        <Button
          viewport={breakpoints.current}
          disabled={invalid || isLoading}
          onClick={onSubmit}
          wide={breakpoints.select({ PhoneOnly: true })}
        >
          Answer
        </Button>
      </View>
    </View>
  </KeyboardAvoidingView>
);

QuestionLayout.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  title: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  invalid: PropTypes.bool,
  isLoading: PropTypes.bool,
  bankIcon: PropTypes.string,
  children: PropTypes.node,
};

export default QuestionLayout;
