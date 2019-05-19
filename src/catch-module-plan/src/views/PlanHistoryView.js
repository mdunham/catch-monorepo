import React from 'react';
import PropTypes from 'prop-types';
import { Platform, View } from 'react-native';

import { Box, Dropdown, colors, styles } from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { PlanActivityView, PlanLayout } from '@catch/common';
import { quarterPeriod, goTo, navigationPropTypes } from '@catch/utils';

import { HistoryCard } from '../components';
import { PlanHistory } from '../containers';

class PlanHistoryView extends React.PureComponent {
  static propTypes = {
    hasDiversifiedIncomeHistory: PropTypes.bool,
    ...navigationPropTypes,
  };
  static defaultProps = {
    hasDiversifiedIncomeHistory: false,
  };
  state = {
    selectedActivityType: null,
    selectedFilter: 'ANY',
  };
  constructor() {
    super();
    this.goTo = goTo.bind(this);
  }
  handleFilterChange = val => {
    this.setState({
      selectedFilter: val,
    });
  };
  handleActivityFilterChange = val => {
    this.setState({
      selectedActivityType: val === '[object Object]' ? null : val,
    });
  };
  render() {
    const {
      isMobile,
      breakpoints,
      hasDiversifiedIncomeHistory,
      viewport,
    } = this.props;
    const { selectedActivityType, selectedFilter } = this.state;

    return (
      <ErrorBoundary component={ErrorMessage}>
        <PlanLayout
          breakpoints={breakpoints}
          style={styles.get(['PageMax', 'Margins'], viewport)}
        >
          <PlanLayout.Column breakpoints={breakpoints}>
            {/* we cant rely solely on their workType to determine which dropdowns to show */}
            {hasDiversifiedIncomeHistory ? (
              <View
                style={styles.get(['FullWidth', 'ContentMax', 'Bilateral'])}
              >
                <View style={styles.get(['Flex1', 'RightGutter'])}>
                  <Dropdown
                    white
                    raised
                    color={colors.ink}
                    input={{
                      onChange: this.handleActivityFilterChange,
                      value: selectedActivityType,
                    }}
                    meta={{}}
                    items={[
                      { label: 'All activity', value: null },
                      { label: 'W2 activity', value: 'PAYCHECK_TYPE_W2' },
                      { label: `1099 activity`, value: 'PAYCHECK_TYPE_1099' },
                    ]}
                    style={styles.get(['FullWidth'])}
                  />
                </View>

                <View style={styles.get(['Flex1'])}>
                  <Dropdown
                    white
                    raised
                    color={colors.ink}
                    input={{
                      onChange: this.handleFilterChange,
                      value: selectedFilter,
                    }}
                    meta={{}}
                    items={[
                      { label: 'All time', value: 'ANY' },
                      { label: 'This year', value: 'YTD' },
                      {
                        label: `This tax quarter: ${quarterPeriod(new Date())}`,
                        value: 'QTD',
                      },
                    ]}
                    style={styles.get(['FullWidth'])}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.get(['FullWidth', 'ContentMax'])}>
                <Dropdown
                  white
                  raised
                  color={colors.ink}
                  input={{
                    onChange: this.handleFilterChange,
                    value: selectedFilter,
                  }}
                  meta={{}}
                  items={[
                    { label: 'All time', value: 'ANY' },
                    { label: 'This year', value: 'YTD' },
                    {
                      label: `This tax quarter: ${quarterPeriod(new Date())}`,
                      value: 'QTD',
                    },
                  ]}
                  style={styles.get(['FullWidth', 'ContentMax'])}
                />
              </View>
            )}
            <PlanHistory
              periodFilter={selectedFilter}
              paycheckType={selectedActivityType}
            >
              {({
                loading,
                error,
                totalSavings,
                grossIncome,
                planMetrics,
                numberOfPaychecks,
              }) =>
                error ? null : (
                  <HistoryCard
                    loading={loading}
                    goTo={this.goTo}
                    grossIncome={grossIncome}
                    planSavings={totalSavings}
                    planMetrics={planMetrics}
                    breakpoints={breakpoints}
                    numberOfPaychecks={numberOfPaychecks}
                  >
                    <Box />
                  </HistoryCard>
                )
              }
            </PlanHistory>
          </PlanLayout.Column>
          <PlanLayout.Column breakpoints={breakpoints}>
            <PlanActivityView
              breakpoints={breakpoints}
              periodFilter={selectedFilter}
              isMobile={isMobile}
            />
          </PlanLayout.Column>
        </PlanLayout>
      </ErrorBoundary>
    );
  }
}

export default PlanHistoryView;
