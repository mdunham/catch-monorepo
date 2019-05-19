import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Box, Text, colors, borderRadius } from '@catch/rio-ui-kit';

const container = {
  backgroundColor: colors['moss--light3'],
  borderWidth: 1,
  borderColor: colors['moss--light2'],
  borderRadius: borderRadius.regular,
};

const BonusCard = ({ title }) => (
  // Prevents card from stretching to parent. Couldn't figure out a better way
  <Box row>
    <Box style={container} p={1} row align="center">
      <Icon
        name="gift"
        size={18}
        stroke={colors.moss}
        fill={colors.moss}
        style={{ opacity: 0.5 }}
      />
      <Text ml={1} color="moss--dark1" weight="medium">
        + {title}
      </Text>
    </Box>
  </Box>
);

BonusCard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default BonusCard;
