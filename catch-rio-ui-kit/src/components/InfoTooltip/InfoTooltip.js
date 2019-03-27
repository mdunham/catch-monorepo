import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import Text from '../Text';
import Tooltip from '../Tooltip';
import { colors } from '../../const';

const InfoTooltip = ({ body, direction = 'left' }) => (
  <Tooltip
    triggerComponent={<Icon name="info" fill="none" size={16} />}
    direction={direction}
    tooltipOffset={{
      left: 10,
      top: -10,
    }}
    p={2}
    style={{ maxWidth: 300 }}
  >
    <Text>{body}</Text>
  </Tooltip>
);

InfoTooltip.propTypes = {
  body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default InfoTooltip;
