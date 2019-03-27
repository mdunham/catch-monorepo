import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { formValueSelector } from 'redux-form';

import {
  Page,
  PageTitle,
  RadialChart,
  LegendRow,
  Box,
  Text,
  Spinner,
  colors,
  withDimensions,
} from '@catch/rio-ui-kit';
import { precisionRound, createLogger } from '@catch/utils';

import { CalculateTaxes, TaxGoal } from '../containers';

const Log = createLogger('tax-breakdown-view');

const CHART_COLORS = [
  colors['wave--dark1'],
  colors.wave,
  colors['wave--light1'],
  colors['wave--light2'],
];

const EMPTY_COLOR = colors.fog;

const PREFIX = 'catch.module.taxes.TaxesBreakdown';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  description: <FormattedMessage id={`${PREFIX}.description`} />,
  disclaimer1: <FormattedMessage id={`${PREFIX}.disclaimer1`} />,
  disclaimer2: <FormattedMessage id={`${PREFIX}.disclaimer2`} />,
  'label.federalTax': <FormattedMessage id={`${PREFIX}.label.federalTax`} />,
  'label.stateTax': <FormattedMessage id={`${PREFIX}.label.stateTax`} />,
  'label.socialSecurity': (
    <FormattedMessage id={`${PREFIX}.label.socialSecurity`} />
  ),
  'label.medicare': <FormattedMessage id={`${PREFIX}.label.medicare`} />,
};

export const TaxesBreakdownView = ({
  viewport,
  numDependents,
  intl: { formatNumber },
}) => (
  <Box mx={1}>
    <CalculateTaxes formValues={{ numDependents }}>
      {({ results, reccPaycheckPercentage, loading }) => (
        <TaxGoal>
          {({ loading: loadingTaxGoal, taxGoal }) => {
            // Already show the text while it loads
            if (loadingTaxGoal || loading) {
              return (
                <React.Fragment>
                  <PageTitle
                    title={COPY['title']}
                    subtitle={COPY['description']}
                  />
                  <Box align="center" justify="center" p={3}>
                    <Spinner large />
                  </Box>
                  <Box mt={40}>
                    <Text size={13} color="ink+1">
                      {COPY['disclaimer1']}
                    </Text>
                  </Box>
                  <Box mt={2} mb={2}>
                    <Text size={13} color="ink+1">
                      {COPY['disclaimer2']}
                    </Text>
                  </Box>
                </React.Fragment>
              );
            }

            const paycheckPercentage = taxGoal
              ? taxGoal.paycheckPercentage
              : reccPaycheckPercentage;

            const federalLiability = {
              label: COPY['label.federalTax'],
              amount: precisionRound(
                results.userResponsibilities.federalLiability,
                2,
              ),
            };
            const stateLiability = {
              label: COPY['label.stateTax'],
              amount: precisionRound(
                results.userResponsibilities.stateLiability,
                2,
              ),
            };
            const socialSecurityLiability = {
              label: COPY['label.socialSecurity'],
              amount: precisionRound(
                results.userResponsibilities.socialSecurityLiability,
                2,
              ),
            };
            const medicareLiability = {
              label: COPY['label.medicare'],
              amount: precisionRound(
                results.userResponsibilities.medicareLiability,
                2,
              ),
            };
            const totalLiability = precisionRound(
              federalLiability.amount +
                stateLiability.amount +
                socialSecurityLiability.amount +
                medicareLiability.amount,
              2,
            );

            // dynamically generate chart/legend data
            let chartData = [];
            let legendData = [];

            if (federalLiability.amount > 0) {
              const percentage =
                (federalLiability.amount / totalLiability) * paycheckPercentage;
              chartData.push(precisionRound(percentage, 3));
              legendData.push({
                label: federalLiability.label,
                percentage,
                qaName: 'federalLiability',
              });
            }

            if (stateLiability.amount > 0) {
              const percentage =
                (stateLiability.amount / totalLiability) * paycheckPercentage;
              chartData.push(precisionRound(percentage, 3));
              legendData.push({
                label: stateLiability.label,
                percentage,
                qaName: 'stateLiability',
              });
            }

            if (socialSecurityLiability.amount > 0) {
              const percentage =
                (socialSecurityLiability.amount / totalLiability) *
                paycheckPercentage;
              chartData.push(precisionRound(percentage, 3));
              legendData.push({
                label: socialSecurityLiability.label,
                percentage,
                qaName: 'socialSecurityLiability',
              });
            }

            if (medicareLiability.amount > 0) {
              const percentage =
                (medicareLiability.amount / totalLiability) *
                paycheckPercentage;
              chartData.push(precisionRound(percentage, 3));
              legendData.push({
                label: medicareLiability.label,
                percentage,
                qaName: 'medicareLiability',
              });
            }

            const sum = chartData.reduce((acc, val) => acc + val);
            const remainder = 1 - sum;

            // dynamically gen colors for chart and legend
            let chartColors = [];
            let i;
            for (i = 0; i < chartData.length; i++) {
              chartColors.push(CHART_COLORS[i]);
            }

            // add empty color for remainder
            chartColors.push(EMPTY_COLOR);

            Log.debug({ chartData, sum, remainder, chartColors });

            return (
              <React.Fragment>
                <PageTitle
                  viewport={viewport}
                  title={COPY['title']}
                  subtitle={COPY['description']}
                />
                <Box
                  row={viewport !== 'PhoneOnly'}
                  justify="space-between"
                  align="center"
                >
                  <Box qaName="taxGoalBreakDown">
                    <RadialChart
                      width={140}
                      height={140}
                      data={[...chartData, remainder]}
                      accessor={d => d}
                      colors={chartColors}
                      legendNumber={formatNumber(sum, {
                        style: 'percent',
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                      legendNumberFontWeight="bold"
                    />
                  </Box>
                  <Box
                    px={2}
                    mt={1}
                    flex={1}
                    w={viewport === 'PhoneOnly' ? 1 : undefined}
                  >
                    {legendData.map((ld, i) => (
                      <LegendRow
                        key={i}
                        label={ld.label}
                        percentage={ld.percentage}
                        backgroundColor={chartColors[i]}
                        minimumFractionDigits={1}
                        maximumFractionDigits={1}
                        mb={1}
                        qaName={ld.qaName}
                      />
                    ))}
                  </Box>
                </Box>
                <Box mt={40}>
                  <Text size={13} color="ink+1">
                    {COPY['disclaimer1']}
                  </Text>
                </Box>
                <Box mt={2} mb={2}>
                  <Text size={13} color="ink+1">
                    {COPY['disclaimer2']}
                  </Text>
                </Box>
              </React.Fragment>
            );
          }}
        </TaxGoal>
      )}
    </CalculateTaxes>
  </Box>
);

TaxesBreakdownView.propTypes = {
  intl: PropTypes.object.isRequired,
  numDependents: PropTypes.number,
};

const withFormValues = connect(state => ({
  numDependents: formValueSelector('TaxGoal')(state, 'numDependents'),
}));

const enhance = compose(
  injectIntl,
  withFormValues,
  withDimensions,
);

export default enhance(TaxesBreakdownView);
