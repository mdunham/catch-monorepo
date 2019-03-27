import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';
import { colors } from '../../const';
import Box from '../Box';
import Text from '../Text';

const CheckboxField = ({ checked, children, color, borderColor, onChange }) => {
  const checkBoxElement = (
    <Checkbox
      value={checked}
      color={color}
      borderColor={borderColor}
      onChange={onChange}
    />
  );
  const list = React.Children.toArray(children);
  return children ? (
    <Box row align="center">
      {checkBoxElement}
      <Box pl={2}>
        <Text size="small">{list[0]}</Text>
        {list[1]}
      </Box>
    </Box>
  ) : (
    checkBoxElement
  );
};

CheckboxField.propTypes = {
  /** toggles checkbox state */
  checked: PropTypes.bool,
  /** The content for label */
  children: PropTypes.node,
  color: PropTypes.string,
  onChange: PropTypes.func,
};

CheckboxField.defaultProps = {
  checked: false,
  color: colors.ink,
};

export default CheckboxField;
