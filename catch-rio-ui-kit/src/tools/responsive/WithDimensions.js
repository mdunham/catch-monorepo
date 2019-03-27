/**
 * Creating a small utility hoc to get the viewport size
 * from the context based on screen dimensions.
 */

/**
 * How to use when implementing responsiveness:
 *
 * 1. add withDimemsions to any component that needs the viewport
 * 2. Destructure `viewport` from props
 * 3. If using a <Box/> primitive, pass viewport into Box component's `screen` props
 */

import React from 'react';
import { Responsive } from './ResponsiveProvider';

const withDimensions = WrappedComponent => {
  const WithDimensions = props => (
    <Responsive.Consumer>
      {screen => <WrappedComponent {...screen} {...props} />}
    </Responsive.Consumer>
  );
  return WithDimensions;
};

export default withDimensions;
