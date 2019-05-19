import React, { Component } from 'react';

import { OptionCard, Box, Text, Icon, colors } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

class Option extends Component {
  handleCheck = () => {
    const { onChange, value } = this.props;
    onChange(value);
  };

  render() {
    const { checked, label, styles, ...rest } = this.props;

    return (
      <OptionCard
        radio
        onClick={this.handleCheck}
        checked={checked}
        title={label}
        {...rest}
      />
    );
  }
}

export default Option;
