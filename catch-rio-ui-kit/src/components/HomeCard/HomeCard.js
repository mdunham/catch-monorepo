import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import Box from '../Box';
import { H3 } from '../Headings';
import Text from '../Text';
import Button from '../Button';
import Paper from '../Paper';
import { colors, animations } from '../../const';

const styles = {
  base: {
    maxWidth: 350,
  },
  inverted: {
    backgroundColor: colors['peach+1'],
  },
};

/**
 * HomeCard is used for home screen call to actions
 */
const HomeCard = ({
  title,
  subtitle,
  buttonText,
  finePrint,
  onClick,
  inverted,
  icon,
  viewport,
  ...rest
}) => (
  <Paper p={3} mx={1} mb={2} style={inverted && styles.inverted} {...rest}>
    <Box row>
      {icon && <Box mr={1}>{icon}</Box>}
      <H3 mb={1}>{title}</H3>
    </Box>
    <Text mb={3}>{subtitle}</Text>
    {!!finePrint && (
      <Text weight="medium" size="small" mb={3}>
        {finePrint}
      </Text>
    )}
    <Button viewport={viewport} inverted={inverted} onClick={onClick} wide>
      {buttonText}
    </Button>
  </Paper>
);

HomeCard.propTypes = {
  children: PropTypes.node,
};

export default HomeCard;
