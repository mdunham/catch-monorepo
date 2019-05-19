import React from 'react';
import { Platform } from 'react-native';
import Text from '../Text';
import { fonts } from '../../const';

const spacingMult = -150;

const makeText = ({
  spacing,
  size,
  color,
  weight,
  children,
  height,
  ariaLevel,
  ...rest
}) => (
  <Text
    role={Platform.select({ web: 'heading', default: undefined })}
    size={size || fonts[`h${ariaLevel}`]}
    spacing={
      spacing || size / spacingMult || fonts[`h${ariaLevel}`] / spacingMult
    }
    weight={weight || 'medium'}
    color={color || 'ink'}
    height={height}
    ariaLevel={ariaLevel}
    {...rest}
  >
    {children}
  </Text>
);

export default makeText;
