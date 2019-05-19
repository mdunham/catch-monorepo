import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Box from '../Box';
import Label from '../Label';

/**
 * RadioGroup encases a group of Radio buttons ensuring they get the correct
 * props for checked state and event handlers.
 */
class RadioGroup extends Component {
  static propTypes = {
    /** Optional css extension */
    className: PropTypes.string,
    /** The content to be rendered */
    children: PropTypes.node,
    /** The content to be rendered */
    onChange: PropTypes.func.isRequired,
    /** The value that gets passed to radio children */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    /** Optional label for the radio group */
    label: PropTypes.string,
  };
  static defaultProps = {
    onChange: () => {},
  };

  render() {
    const { label, children, value, onChange, ...other } = this.props;

    return (
      <Box {...other}>
        {label && <Label mb={1}>{label}</Label>}
        {React.Children.map(children, (child, i) =>
          React.cloneElement(child, {
            key: child.props.name,
            checked: value === child.props.value,
            onChange,
          }),
        )}
      </Box>
    );
  }
}

export default RadioGroup;
