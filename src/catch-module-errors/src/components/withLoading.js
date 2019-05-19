import * as React from 'react';
import { Box, Spinner } from '@catch/rio-ui-kit';
import { branch, renderComponent } from 'recompose';

const Loader = () => (
  <Box flex={1} align="center" justify="center">
    <Box p={3}>
      <Spinner />
    </Box>
  </Box>
);

function withLoader(Component = Loader) {
  return branch(props => props.data.loading, renderComponent(Component));
}
export default withLoader;
