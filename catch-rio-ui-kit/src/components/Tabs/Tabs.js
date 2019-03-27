import React, { Children, cloneElement, Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { TabPanels, TabList } from '.';

/**
 * Tabs control the compound state for controlling what Tab is currently active
 *
 * TODO: Allow tabs to be controlled or uncontrolled since some UI state will
 * want to be able to programatically change which tab is active and I don't
 * want to have imperative ref's
 */
class Tabs extends Component {
  static propTypes = {
    /** The content to be rendered */
    children: PropTypes.node,
  };
  constructor(props) {
    super(props);
    this.state = {
      activeIdx: props.activeIdx || 0,
    };
  }

  handleTab = activeIdx => this.setState({ activeIdx });

  render() {
    const { activeIdx } = this.state;
    const { children, ...other } = this.props;

    return (
      <View {...other}>
        {Children.map(children, (child, i) => {
          if (child.type === TabList) {
            return cloneElement(child, {
              activeIdx,
              onTabClick: this.handleTab,
            });
          } else if (child.type === TabPanels) {
            return cloneElement(child, { activeIdx });
          } else {
            // It's okay for Tab to have random children
            return child;
          }
        })}
      </View>
    );
  }
}

export default Tabs;
