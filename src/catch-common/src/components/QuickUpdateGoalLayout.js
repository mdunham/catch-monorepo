import React, { Component } from 'react';
import { func, number, oneOfType, object, string } from 'prop-types';
import { StyleSheet } from 'react-native';

import { Box, H2, H3, Text, Flag, colors } from '@catch/rio-ui-kit';
import { formatCurrency, Percentage } from '@catch/utils';

import TaxRateSplitCard from './TaxRateSplitCard';
import UpdateInfoModal from './UpdateInfoModal';

const styles = StyleSheet.create({
  border: {
    borderRightWidth: 1,
    borderColor: colors['charcoal--light3'],
    height: 100,
  },
});

class QuickUpdateGoalLayout extends Component {
  static propTypes = {
    title: oneOfType([string, object]).isRequired,
    description: oneOfType([string, object]).isRequired,
    currentPercentage: number.isRequired,
    reccPercentage: number.isRequired,
    currentMonthlyContribution: number.isRequired,
    reccMonthlyContribution: number.isRequired,
    keep: func.isRequired,
    update: func.isRequired,
  };

  render() {
    const {
      title,
      description,
      reccPercentage,
      currentPercentage,
      currentMonthlyContribution,
      reccMonthlyContribution,
      keep,
      update,
    } = this.props;
    return (
      <UpdateInfoModal
        title={title}
        cancelButtonText="Keep current"
        saveButtonText="Update"
        showDescription={false}
        onCancel={keep}
        onSave={update}
      >
        <Box mb={3}>
          <Text>{description}</Text>
        </Box>
        <TaxRateSplitCard
          currentRate={currentPercentage}
          currentEstimate={currentMonthlyContribution}
          suggestedRate={reccPercentage}
          suggestedEstimate={reccMonthlyContribution}
        />
      </UpdateInfoModal>
    );
  }
}

export default QuickUpdateGoalLayout;
