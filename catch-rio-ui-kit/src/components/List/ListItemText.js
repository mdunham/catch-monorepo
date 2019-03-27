import React from 'react';
import PropTypes from 'prop-types';

import Text from '../Text';
import Box from '../Box';

/**
 * ListItemText allows to group two rows in text for list rows.
 */
const ListItemText = ({
  primary,
  secondary,
  inset,
  disabled,
  primaryProps,
  secondaryProps,
  style,
  ...other
}) => (
  <Box style={[styles.base, inset && styles.inset, style]}>
    <Text {...primaryProps}>{primary}</Text>
    {secondary && (
      <Box pt={1}>
        <Text size="small" color="subtle" {...secondaryProps}>
          {secondary}
        </Text>
      </Box>
    )}
  </Box>
);

const styles = {
  base: {
    flex: 1,
  },
  inset: {
    paddingLeft: 35,
  },
};

ListItemText.propTypes = {
  /** Primary content to render */
  primary: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  /** Secondary subtle content to render */
  secondary: PropTypes.string,
  /** Should the text be inset? */
  inset: PropTypes.bool,
  /** If true, text is disabled */
  disabled: PropTypes.bool,
  /** Optional style object */
  style: PropTypes.object,
  /** Optional prop extension for the primary text */
  primaryProps: PropTypes.object,
  /** Optional prop extension for the secondary text */
  secondaryProps: PropTypes.object,
};

ListItemText.defaultProps = {
  inset: false,
  disabled: false,
  primaryProps: {},
  secondaryProps: {},
};

export default ListItemText;
