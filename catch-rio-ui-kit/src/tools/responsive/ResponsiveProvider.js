import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions } from 'react-native';

const breakpoints = {
  PhoneOnly: 474,
  TabletPortraitUp: 799,
  TabletLandscapeUp: 800,
  desktopUp: 1200,
};

const initialState = {
  viewport: 'PhoneOnly',
  size: {},
};

export const Responsive = React.createContext(initialState);

/**
 * *ResponsiveProvider* is a higher order component that enables responsiveness
 * to Box/Flex components by supplying them with a viewport size
 * dynamically in the react context.
 * @NOTE: The breakpoints have been simplified in the
 * @function selectViewport for now. We can enable more layout
 * sizes later on.
 */

class ResponsiveProvider extends React.Component {
  constructor(props) {
    super(props);
    const size = {
      window: Dimensions.get('window'),
    };
    const viewport = this.selectViewport(size);
    this.state = {
      viewport,
      breakpoints: {
        ...breakpoints,
        select: this.breakpointsSelector,
        current: viewport,
      },
      size,
    };
  }
  componentDidMount() {
    Dimensions.addEventListener('change', this.handleChange);
  }
  componentWillUnmount() {
    Dimensions.removeEventListener('change', this.handleChange);
  }
  handleChange = size => {
    const screenSize = this.selectViewport(size);
    const { screen, breakpoints } = this.state;
    if (screenSize !== screen) {
      this.setState({
        viewport: screenSize,
        breakpoints: {
          ...breakpoints,
          current: screenSize,
        },
        size,
      });
    }
  };
  selectViewport = ({ window: { width } }) => {
    if (width > 799) {
      return 'TabletLandscapeUp';
    } else if (width > 474) {
      return 'TabletPortraitUp';
    } else {
      return 'PhoneOnly';
    }
  };
  /**
   * Allows for using multiple selectors in a computed
   * property such as `PhoneOnly|TabletLandscapeUp|...`
   */
  breakpointsSelector = opts => {
    const { viewport } = this.state;
    if (!opts || !viewport) {
      return;
    }
    if (typeof opts[viewport] === 'undefined') {
      for (const key in opts) {
        if (key.includes(viewport)) {
          return opts[key];
        }
      }
    }
    return opts[viewport] || opts.default;
  };
  render() {
    return (
      <Responsive.Provider value={this.state}>
        {this.props.children}
      </Responsive.Provider>
    );
  }
}

export default ResponsiveProvider;
