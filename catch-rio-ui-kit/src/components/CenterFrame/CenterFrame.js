import React from 'react';
import PropTypes from 'prop-types';

import Paper from '../Paper';
import PageWrapper from '../Page';

// Not sure what is more convenient to expose as an api on this component
// We can figure it out as we start reusing it places
const CenterFrame = ({ children, width, height, isMobile, ...other }) => (
  <PageWrapper align="center" noPadding={isMobile} {...other}>
    <Paper
      flat
      white
      align="center"
      p={5}
      justify="center"
      style={{ width, height, flex: isMobile ? 1 : undefined }}
    >
      {children}
    </Paper>
  </PageWrapper>
);

CenterFrame.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
};

CenterFrame.defaultProps = {
  width: 700,
  height: 530,
};

export default CenterFrame;
