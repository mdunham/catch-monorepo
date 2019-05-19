import React from 'react';
import { number, object, oneOfType, string } from 'prop-types';

import { Box, Flex, Text } from '@catch/rio-ui-kit';
import { formatCurrency } from '@catch/utils';

/**
 * In this case, a 'vertical' refers to an offering (pto, tax, retirement)
 */

const VerticalRow = ({ label, amount }) => (
  <Flex mt={1} row>
    <Box>
      <Text weight="medium" textCase="capitalize">
        {label}
      </Text>
    </Box>
    <Box ml="auto">
      <Text>{formatCurrency(parseFloat(amount).toFixed(2))}</Text>
    </Box>
  </Flex>
);

VerticalRow.propTypes = {
  amount: oneOfType([number, string]).isRequired,
  label: oneOfType([object, string]).isRequired,
};

export default VerticalRow;
