import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Text';
import { H4 } from '../Headings';
import Box from '../Box';
import Paper from '../Paper';
import { colors, animations, borderRadius } from '../../const';

const styles = {
  header: {
    height: 136,
    backgroundColor: colors['wave--light2'],
    borderTopLeftRadius: borderRadius.regular,
    borderTopRightRadius: borderRadius.regular,
  },
};

const HeaderCard = ({ title, subtitle, children, ...other }) => (
  <Paper mb={2} {...other}>
    <Box style={styles.header}>{children}</Box>
    <Box p={3}>
      <H4 mb={1}>{title}</H4>
      <Text>{subtitle}</Text>
    </Box>
  </Paper>
);

export default HeaderCard;
