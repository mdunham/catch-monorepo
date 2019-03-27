import React from 'react';
import PropTypes from 'prop-types';

import { Text, Tooltip, colors } from '@catch/rio-ui-kit';

const UsCitizenTooltip = ({ trigger, body }) => (
  <Tooltip
    triggerComponent={
      <Text color="link" size="small" weight="medium" selectable={false}>
        {trigger}
      </Text>
    }
    direction="left"
    tooltipOffset={{
      left: -8,
      top: -10,
    }}
    p={2}
    style={{ maxWidth: 348 }}
  >
    <Text>{body}</Text>
  </Tooltip>
);

UsCitizenTooltip.propTypes = {
  trigger: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default UsCitizenTooltip;
