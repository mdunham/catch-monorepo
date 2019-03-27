import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Platform } from 'react-native';
/**
 * List is an accessible component for web and native using aria listbox role.
 */
class List extends React.PureComponent {
  render() {
    const { children, style, maxHeight, ...other } = this.props;
    return (
      <ScrollView
        accessibilityRole={Platform.select({ web: 'listbox' })}
        accessible={true}
        contentContainerStyle={[{ maxHeight }, style]}
        {...other}
      >
        {children}
      </ScrollView>
    );
  }
}

export default List;
