import React from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity } from 'react-native';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Paper,
  Box,
  Text,
  Divider,
  colors,
  Label,
  Icon,
  styles,
} from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';

const PREFIX = 'catch.module.plan.HistoryCard';
export const COPY = {
  grossIncome: <FormattedMessage id={`${PREFIX}.grossIncome`} />,
  planSavings: <FormattedMessage id={`${PREFIX}.planSavings`} />,
  planSavingsLabel: <FormattedMessage id={`${PREFIX}.planSavingsLabel`} />,
  totalContributions: <FormattedMessage id={`${PREFIX}.totalContributions`} />,
  totalIncome: <FormattedMessage id={`${PREFIX}.totalIncome`} />,
  paychecks: <FormattedMessage id={`${PREFIX}.paychecks`} />,
};

export class HistoryCard extends React.PureComponent {
  static propTypes = {
    grossIncome: PropTypes.number,
    planSavings: PropTypes.number,
    planMetrics: PropTypes.array,
    numberOfPaychecks: PropTypes.number,
    goTo: PropTypes.func,
    intl: PropTypes.shape({
      formatNumber: PropTypes.func,
    }),
  };
  static defaultProps = {
    grossIncome: 0,
    planSavings: 0,
    planMetrics: [],
  };
  state = {
    showCoachmark: true,
    showBalance: true,
  };
  toggleBalance = () => {
    this.setState(({ showBalance, showLabel }) => ({
      showCoachmark: false,
      showBalance: !showBalance,
    }));
  };
  render() {
    const {
      grossIncome,
      planSavings,
      planMetrics,
      numberOfPaychecks,
      goTo,
      breakpoints,
      intl: { formatNumber },
    } = this.props;
    const { showBalance } = this.state;

    return (
      <React.Fragment>
        <Paper p={3} style={styles.get(['FullWidth', 'ContentMax'])}>
          <Box justify="center" my={2}>
            <Box row>
              <Icon
                dynamicRules={{ paths: { fill: colors.ink } }}
                fill={colors.ink}
                name="planpig"
                size={Platform.select({ web: 44 })}
              />
              <Box ml={2}>
                <Text weight="bold" size={24}>
                  <Currency>{planSavings}</Currency>
                </Text>
                <Text size="small">{COPY['planSavingsLabel']}</Text>
              </Box>
            </Box>

            <Divider mt={2} />
          </Box>

          {!!planMetrics &&
            planMetrics.map((plan, i) => (
              <Box row justify="space-between" key={i} my={1}>
                <TouchableOpacity
                  onPress={() => goTo(['/plan', plan.path, '/overview'])}
                >
                  <Text weight="medium">{plan.title}</Text>
                </TouchableOpacity>
                <Text onClick={this.toggleBalance}>
                  {showBalance ? ( // We divide by 1 here to avoid NaN
                    <Currency>{plan.balance}</Currency>
                  ) : (
                    formatNumber(plan.balance / (grossIncome || 1), {
                      style: 'percent',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 1,
                    })
                  )}
                </Text>
              </Box>
            ))}
          {breakpoints.select({
            PhoneOnly: (
              <React.Fragment>
                <Divider mt={2} mb={3} />
                <Box row>
                  <Box align="center" w={1 / 2}>
                    <Text weight="bold" size="large">
                      {numberOfPaychecks}
                    </Text>
                    <Text size="small">{COPY['paychecks']}</Text>
                  </Box>
                  <Divider vertical height={36} />
                  <Box align="center" w={1 / 2}>
                    <Text weight="bold" size="large">
                      <Currency>{grossIncome}</Currency>
                    </Text>
                    <Text size="small">{COPY['totalIncome']}</Text>
                  </Box>
                </Box>
              </React.Fragment>
            ),
          })}
        </Paper>

        {breakpoints.select({
          'TabletLandscapeUp|TabletPortraitUp': (
            <Paper
              p={3}
              style={styles.get(['FullWidth', 'ContentMax', 'TopGutter'])}
            >
              <Box row>
                <Box align="center" w={1 / 2}>
                  <Text weight="bold" size="large">
                    {numberOfPaychecks}
                  </Text>
                  <Text size="small">{COPY['paychecks']}</Text>
                </Box>
                <Divider vertical height={36} />
                <Box align="center" w={1 / 2}>
                  <Text weight="bold" size="large">
                    <Currency>{grossIncome}</Currency>
                  </Text>
                  <Text size="small">{COPY['totalIncome']}</Text>
                </Box>
              </Box>
            </Paper>
          ),
        })}
      </React.Fragment>
    );
  }
}

export default injectIntl(HistoryCard);
