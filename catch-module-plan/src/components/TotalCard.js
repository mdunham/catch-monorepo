import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { injectIntl, FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';

import {
  Paper,
  Flex,
  Box,
  Text,
  colors,
  animations,
  borderRadius,
  RadialChart,
  Hoverable,
  Icon,
  styles as S,
} from '@catch/rio-ui-kit';
import { createLogger } from '@catch/utils';

const Log = createLogger('total-chart');

const styles = StyleSheet.create({
  box: {
    borderRadius: 999,
    height: 130,
    width: 130,
    borderColor: colors.gray5,
    borderWidth: 6,
  },
  bullet: {
    borderRadius: 71994,
    height: 9,
    width: 9,
    marginRight: 10,
  },
  snapshot: {
    minHeight: 70,
    ...Platform.select({
      web: {
        ...animations.fade,
      },
    }),
  },
  icon: {
    padding: 8,
  },
  iconHover: {
    backgroundColor: colors['sage+1'],
    borderRadius: borderRadius.regular,
  },
});

// @TODO: this should probably be extracted to style-const and util-const
const BREAKDOWN_COLORS = ['#FEB198', '#68AEAE', '#B5BC5E', '#EA8C9D'];
const TOTAL_COLORS = [colors['ink'], colors['ink+3']];
const EMPTY_COLOR = colors['ink+3'];

const PLAN_TITLES = {
  tax: 'Taxes',
  pto: 'Time off',
  retirement: 'Retirement',
};
// Oh god...
const PLAN_PATHS = {
  tax: '/taxes',
  pto: '/timeoff',
  retirement: '/retirement',
};

const PREFIX = 'catch.module.plan.TotalCard';
export const COPY = {
  'snapshot.default': values => (
    <FormattedMessage id={`${PREFIX}.snapshot.default`} values={values} />
  ),
  'noReadyAccounts.default': (
    <FormattedMessage id={`${PREFIX}.noReadyAccounts.default`} />
  ),
};

export class TotalCard extends React.PureComponent {
  state = {
    showBreakdown: false,
    // holdBreakdown: false,
  };
  toggleBreakdown = isHovered => {
    const { showBreakdown, holdBreakdown } = this.state;
    if (isHovered !== showBreakdown && !holdBreakdown) {
      this.setState({
        showBreakdown: isHovered,
      });
    }
  };

  // Debounce to avoid flickering
  handleHover = debounce(this.toggleBreakdown, 100);

  // Might be useful for native later
  // handleClick = _ => {
  //   this.setState(({ holdBreakdown }) => ({
  //     holdBreakdown: !holdBreakdown,
  //     showBreakdown: !holdBreakdown,
  //   }));
  // };
  render() {
    const {
      children,
      total,
      breakdown,
      intl: { formatNumber },
      goTo,
      hasAtLeastOneReadyAccount,
      onEdit,
      viewport,
    } = this.props;

    const { showBreakdown } = this.state;

    const activeKeys = !!breakdown
      ? Object.keys(breakdown).filter(key => !!breakdown[key])
      : [];

    const totalData = [{ percent: total }, { percent: 1 - total }];
    const breakdownData = activeKeys
      .map(key => ({ percent: breakdown[key].paycheckPercentage }))
      .concat([{ percent: 1 - total }]);

    const breakdownColors = activeKeys
      .map((key, i) => BREAKDOWN_COLORS[i])
      .concat([EMPTY_COLOR]);

    return (
      <Paper
        w={1}
        pt={3}
        pb={4}
        px={3}
        mb={3}
        flex={hasAtLeastOneReadyAccount ? undefined : 1}
        style={{
          ...Platform.select({
            web: {
              minWidth: 255,
              maxWidth: viewport === 'PhoneOnly' ? '100%' : 350,
              ...animations.fadeInUp,
            },
          }),
        }}
      >
        {hasAtLeastOneReadyAccount && (
          <View style={S.get('CenterRightRow')}>
            <Hoverable>
              {isHovered => (
                <TouchableOpacity
                  onPress={onEdit}
                  style={[styles.icon, isHovered && styles.iconHover]}
                >
                  <Icon size={18} name="pencil" />
                </TouchableOpacity>
              )}
            </Hoverable>
          </View>
        )}
        {hasAtLeastOneReadyAccount && (
          <Box qaName="totalPercent" align="center">
            <Hoverable onUpdate={this.handleHover}>
              <View>
                <RadialChart
                  width={136}
                  height={136}
                  data={showBreakdown ? breakdownData : totalData}
                  legendNumber={formatNumber(total, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                  legendText="SET ASIDE"
                  accessor={d => d.percent}
                  colors={showBreakdown ? breakdownColors : TOTAL_COLORS}
                />
              </View>
            </Hoverable>
          </Box>
        )}
        <Box pt={hasAtLeastOneReadyAccount ? 4 : 0}>
          <Text size="nav" weight="medium">
            Snapshot
          </Text>
        </Box>

        {hasAtLeastOneReadyAccount &&
          (showBreakdown ? (
            <Box mt={1} style={styles.snapshot} key="breakdown-list">
              {activeKeys.map((key, i) => (
                // TODO (tc) Touchable is not neccessary here but will make a reusable
                // component soon
                <TouchableOpacity
                  onPress={() => goTo(['/plan', PLAN_PATHS[key], '/overview'])}
                  key={i}
                >
                  <Box row justify="space-between">
                    <Box row align="center">
                      <Box
                        style={[
                          styles.bullet,
                          { backgroundColor: BREAKDOWN_COLORS[i] },
                        ]}
                      />
                      <Text weight="medium">{PLAN_TITLES[key]}</Text>
                    </Box>
                    <Text>
                      {formatNumber(breakdown[key].paycheckPercentage, {
                        style: 'percent',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                    </Text>
                  </Box>
                </TouchableOpacity>
              ))}
            </Box>
          ) : (
            <Box mt={1} style={styles.snapshot} key="snapshot-text">
              <Text size="small">
                {COPY['snapshot.default']({
                  percent: formatNumber(total, {
                    style: 'percent',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }),
                })}
              </Text>
            </Box>
          ))}

        {!hasAtLeastOneReadyAccount && (
          <Box mt={2}>
            <Text color="subtle">{COPY['noReadyAccounts.default']}</Text>
          </Box>
        )}
        <Box>{children}</Box>
      </Paper>
    );
  }
}

const Component = injectIntl(TotalCard);

Component.displayName = 'TotalCard';

export default Component;
