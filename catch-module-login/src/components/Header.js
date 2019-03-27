import React from 'react';
import PropTypes from 'prop-types';

import { H2, Text } from '@catch/rio-ui-kit';

const Header = ({ title, subtitle, viewport, small }) => (
  <React.Fragment>
    <H2 mb={1} size={viewport === 'PhoneOnly' ? 18 : 24}>
      {title}
    </H2>
    <Text mb={4} size={viewport === 'PhoneOnly' ? 15 : small ? 15 : 18}>
      {subtitle}
    </Text>
  </React.Fragment>
);

Header.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  subtitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default Header;
