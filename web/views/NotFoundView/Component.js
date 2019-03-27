import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Flex, Box, Link, H1 } from '@catch/rio-ui-kit';

class HomeView extends Component {
  static propTypes = {
    givenName: PropTypes.string,
  };

  render() {
    return (
      <Flex id="home-view">
        <Flex align="center">
          <Box mb={2} mt={5} align="center">
            <H1>Page Not Found</H1>
          </Box>
          <Link to="/">Back Home</Link>
        </Flex>
      </Flex>
    );
  }
}

export default HomeView;
