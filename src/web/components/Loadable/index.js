import Loadable from 'react-loadable';
import React from 'react';
import { Flex, Box, Spinner } from '@catch/rio-ui-kit';

function Loading() {
  return (
    <Flex>
      <Box p={3}>
        <Spinner />
      </Box>
    </Flex>
  );
}

export default (opts = {}) => {
  return Loadable({
    loading: Loading,
    delay: 200,
    timeout: 10000,

    ...opts,
  });
};
