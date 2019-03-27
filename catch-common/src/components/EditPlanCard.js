import React from 'react';
import PropTypes from 'prop-types';

import { Icon, Box, Paper, Text, H4, colors, Divider } from '@catch/rio-ui-kit';

const divider = {
  borderLeftWidth: 1,
  borderLeftColor: colors['charcoal--light4'],
};

const iconNameMap = {
  Tax: 'tax',
  PTO: 'timeoff',
  Retirement: 'retirement',
};

const EditPlanCard = ({ onEdit, goalName, planTitle, caption }) => (
  <Paper
    p={3}
    mb={4}
    row
    align="center"
    justify="space-between"
    style={{ maxWidth: 350 }}
    w={1}
  >
    <Box row align="center" mr={1}>
      <Icon name={iconNameMap[goalName]} size={38} />
      <Box ml={2}>
        <Text size={16} weight="bold">
          {planTitle}
        </Text>
        <Text size={14} weight="medium" color="smoke">
          {caption}
        </Text>
      </Box>
    </Box>
    <Box pl={3} py={2} style={divider}>
      <Icon
        name="pencil"
        size={18}
        fill={colors.smoke}
        dynamicRules={{ paths: { fill: colors.smoke } }}
        onClick={onEdit}
      />
    </Box>
  </Paper>
);

EditPlanCard.propTypes = {
  onEdit: PropTypes.func,
  goalName: PropTypes.string,
  planTitle: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  caption: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default EditPlanCard;
