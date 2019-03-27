import React from 'react';
import PropTypes from 'prop-types';
import Box from '../Box';
import ResponsiveContainer from '../ResponsiveContainer';
import withDimensions from '../../tools/responsive';

const GAP_LG = 5;
const GAP_SM = 4;
const GAP_TINY = 2;
const COLUMN_LG = 3 / 5;
const COLUMN_SM = 2 / 5;
const COLUMN_HALF = 1 / 2;

const SIZING = {
  master: {
    left: COLUMN_LG,
    right: COLUMN_SM,
    gap: GAP_SM,
  },
  detail: {
    left: COLUMN_SM,
    right: COLUMN_LG,
    gap: GAP_SM,
  },
  default: {
    left: COLUMN_HALF,
    right: COLUMN_HALF,
    gap: GAP_LG,
  },
  tinyGap: {
    left: COLUMN_HALF,
    right: COLUMN_HALF,
    gap: GAP_TINY,
  },
};

// set mode to 'master' or 'detail', or it'll be half/half
export const SplitLayout = ({
  children,
  viewport: screen,
  mode,
  type,
  reverse,
  renderLeft,
  renderRight,
  containerStyle,
  ...rest
}) => {
  const viewport = {
    SIZE: screen,
    select: obj => (screen in obj ? obj[screen] : obj.default),
  };
  const sizing = SIZING[mode] || SIZING.default;
  const childrenArray = React.Children.toArray(children);
  const leftChild = childrenArray[reverse ? 1 : 0];
  const rightChild = childrenArray[reverse ? 0 : 1];

  return (
    <ResponsiveContainer viewport={screen} style={containerStyle} {...rest}>
      <Box w={[1, null, sizing.left]} screen={screen} pr={[0, 0, sizing.gap]}>
        {typeof renderLeft === 'function'
          ? renderLeft({ viewport })
          : leftChild}
      </Box>
      <Box w={[1, null, sizing.right]} screen={screen} pl={[0, 0, sizing.gap]}>
        {typeof renderRight === 'function'
          ? renderRight({ viewport })
          : rightChild}
      </Box>
    </ResponsiveContainer>
  );
};

SplitLayout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  containerStyle: PropTypes.object,
  viewport: PropTypes.string,
  mode: PropTypes.string,
  type: PropTypes.string,
  reverse: PropTypes.bool,
  renderLeft: PropTypes.func,
  renderRight: PropTypes.func,
};

export default withDimensions(SplitLayout);
