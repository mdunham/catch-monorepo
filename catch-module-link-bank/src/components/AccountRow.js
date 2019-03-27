import React from 'react';
import { FormattedNumber } from 'react-intl';
import { TouchableOpacity } from 'react-native';

import { Text, Flex, Box, borderRadius, colors } from '@catch/rio-ui-kit';

import { formatCurrency } from '@catch/utils';

// TODO - write a test for this and types

const base = {
  borderRadius: borderRadius.regular,
};

const AccountRow = ({ balance, nickname, name, onClick }) => (
  <TouchableOpacity onPress={onClick} disabled={!onClick}>
    <Flex mb={0} px={1} py={2} style={base}>
      <Flex row>
        <Box justify="center">
          <Text weight="medium">{nickname ? nickname : name}</Text>
        </Box>
      </Flex>
    </Flex>
  </TouchableOpacity>
);

export default AccountRow;
