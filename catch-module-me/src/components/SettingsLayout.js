import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, ScrollView, Text, Platform } from 'react-native';
import { styles } from '@catch/rio-ui-kit';

const SettingsLayout = ({ breakpoints, title, children }) => (
  <KeyboardAvoidingView
    style={styles.get(['Container', 'White'])}
    behavior={Platform.select({ ios: 'padding' })}
  >
    <ScrollView
      contentContainerStyle={styles.get('Frame', breakpoints.current)}
    >
      {!!title && (
        <Text style={styles.get(['H4', 'LgBottomGutter'], breakpoints.current)}>
          {title}
        </Text>
      )}
      {children}
    </ScrollView>
  </KeyboardAvoidingView>
);

SettingsLayout.propTypes = {
  breakpoints: PropTypes.object.isRequired,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node,
};

export default SettingsLayout;
