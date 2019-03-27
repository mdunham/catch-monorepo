import React, { Component } from 'react';
import { object, number } from 'prop-types';

import { Box, SplitLayout } from '@catch/rio-ui-kit';

import { BreakdownChart, BreakdownLegend } from '../components';

const PLAN_TITLES = {
  tax: 'Taxes',
  pto: 'Time off',
  retirement: 'Retirement',
};

class AllocationsBreakdown extends Component {
  static propTypes = {
    formValues: object,
    goals: object.isRequired,
    total: number.isRequired,
  };

  render() {
    const { formValues, goals, livePercentages, total } = this.props;

    const activeKeys = !!goals
      ? Object.keys(goals).filter(key => !!goals[key])
      : [];

    const breakdownData = formValues
      ? activeKeys
          .map(key => ({ percent: livePercentages[key] }))
          .concat([{ percent: 1 - livePercentages.total }])
      : activeKeys
          .map(key => ({ percent: goals[key].paycheckPercentage }))
          .concat([{ percent: 1 - total }]);

    const legendData = formValues
      ? {
          pto: goals.pto && { paycheckPercentage: livePercentages.pto },
          tax: goals.tax && { paycheckPercentage: livePercentages.tax },
          retirement: goals.retirement && {
            paycheckPercentage: livePercentages.retirement,
          },
        }
      : goals;

    return (
      <Box>
        <Box align="center" mb={1}>
          <BreakdownChart
            activeKeys={activeKeys}
            data={breakdownData}
            total={total}
          />
        </Box>
        <Box mt={3}>
          <BreakdownLegend
            titles={PLAN_TITLES}
            activeKeys={activeKeys}
            data={legendData}
          />
        </Box>
      </Box>
    );
  }
}

export default AllocationsBreakdown;
