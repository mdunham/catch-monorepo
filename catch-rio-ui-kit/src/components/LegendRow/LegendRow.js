import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { injectIntl, FormattedMessage } from 'react-intl';

import Text from '../Text';
import Box from '../Box';

const styles = StyleSheet.create({
  bullet: {
    borderRadius: 71994,
    height: 9,
    width: 9,
    marginRight: 10,
  },
});

export const LegendRow = ({
  backgroundColor,
  label,
  intl: { formatNumber },
  percentage,
  minimumFractionDigits,
  maximumFractionDigits,
  qaName,
  ...other
}) => (
  <Box row justify="space-between" {...other}>
    <Box row align="center">
      <Box style={[styles.bullet, { backgroundColor }]} />
      <Text weight="medium">{label}</Text>
    </Box>
    <Text qaName={qaName}>
      {formatNumber(percentage, {
        style: 'percent',
        minimumFractionDigits,
        maximumFractionDigits,
      })}
    </Text>
  </Box>
);

LegendRow.defaultProps = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  qaName: 'LegendRowText',
};

export default injectIntl(LegendRow);
