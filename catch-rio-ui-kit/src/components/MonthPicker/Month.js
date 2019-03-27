import React from 'react';
import { TouchableOpacity } from 'react-native';
import { colors } from '../../const';
import Box from '../Box';
import Text from '../Text';

function Month({ children, onClick, styles, ...rest }) {
  return (
    <TouchableOpacity onPress={onClick} {...rest}>
      <Box style={base}>
        <Text center>{children}</Text>
      </Box>
    </TouchableOpacity>
  );
}

const base = {
  padding: 10,
  width: 55,
  backgroundColor: colors.gray5,
  borderRadius: 3,
  userSelect: 'none',
};

export default Month;
