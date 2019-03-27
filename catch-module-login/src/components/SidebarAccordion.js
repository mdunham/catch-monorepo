import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity } from 'react-native';

import { Box, Text, Icon, colors, ExpandCollapser } from '@catch/rio-ui-kit';

class SidebarAccordion extends React.PureComponent {
  static propTypes = {
    sections: PropTypes.array,
  };
  state = {
    show: null,
  };
  toggleAccordion = sectionIdx => {
    this.setState(({ show }) => {
      if (sectionIdx === show) {
        return {
          show: null,
        };
      }
      return {
        show: sectionIdx,
      };
    });
  };
  /**
   * Allows us to measure the element without really knowing what it will be
   * caveat: it should expose the react native api or it won't work
   */
  cloneAndRender = (content, i) => {
    const child = React.Children.only(content);
    return React.cloneElement(child, {
      onLayout: m => this.measureClone(m, i),
    });
  };
  /**
   * We need the height in order to animate it!
   */
  measureClone = (m, i) => {
    const cloneId = `content-${i}`;
    const { nativeEvent: { layout: { height } } } = m;
    this.setState({
      [cloneId]: height + 12, // provides a little margin
    });
  };
  render() {
    const { sections, ...other } = this.props;
    const { show } = this.state;
    return (
      <Box {...other}>
        {sections.map((section, i) => (
          <React.Fragment key={`accordion-node-${i}`}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.toggleAccordion(i)}
            >
              <Box row pb={2} align="center">
                <Icon
                  name="right"
                  size={8}
                  style={
                    show === i
                      ? {
                          transform: [{ rotate: '90deg' }],
                        }
                      : undefined
                  }
                  fill={colors['charcoal--light1']}
                  stroke={colors['charcoal--light1']}
                />
                <Text weight="medium" ml={1}>
                  {section.title}
                </Text>
              </Box>
            </TouchableOpacity>
            <ExpandCollapser
              isOpen={show === i}
              height={this.state[`content-${i}`]}
            >
              {this.cloneAndRender(section.content, i)}
            </ExpandCollapser>
          </React.Fragment>
        ))}
      </Box>
    );
  }
}

export default SidebarAccordion;
