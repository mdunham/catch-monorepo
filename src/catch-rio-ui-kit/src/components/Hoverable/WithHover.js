import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';
import Hoverable from './Hoverable';

/**
 * This hoc helps with extracting the Hoverable out of
 * components for better testing experience.
 *
 */
const withHover = WrappedComponent => {
  class WithHover extends React.PureComponent {
    render() {
      return Platform.select({
        web: (
          <Hoverable>
            {(isHovered, toggleHover) => (
              <View style={this.props.style}>
                <WrappedComponent
                  isHovered={isHovered}
                  toggleHover={toggleHover}
                  {...this.props}
                />
              </View>
            )}
          </Hoverable>
        ),
        default: <WrappedComponent {...this.props} />,
      });
    }
  }
  WithHover.displayName = `WithHover(${getDisplayName(WrappedComponent)})`;
  return WithHover;
};

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

export default withHover;
