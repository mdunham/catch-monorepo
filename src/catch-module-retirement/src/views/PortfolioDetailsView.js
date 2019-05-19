import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Text, Divider, colors, withDimensions } from '@catch/rio-ui-kit';
import { Env } from '@catch/utils';

import { AssetList, PerformanceChart } from '../components';

import {
  AGE_COPY,
  buildRecommendationCopy,
} from './PortfolioSelectionView/COPY';

const styles = StyleSheet.create({
  assetList: {
    backgroundColor: colors.white,
  },
});

const PREFIX = 'catch.module.retirement.PortfolioSelectionView';
export const COPY = {
  'recommendation.title': (
    <FormattedMessage id={`${PREFIX}.recommendation.title`} />
  ),
  portfolio: <FormattedMessage id={`${PREFIX}.portfolio`} />,
  historicalPerformance: (
    <FormattedMessage id={`${PREFIX}.historicalPerformance`} />
  ),
};

export const PortfolioDetailsView = ({
  age,
  ageSuggestion,
  riskLevel,
  riskComfort,
  selectedPortfolioDetails,
}) => (
  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <Text weight="medium" size={24}>
      {selectedPortfolioDetails.name}{' '}
      <Text size={24} weight="normal">
        {COPY['portfolio']}
      </Text>
    </Text>

    <Text my={1}>{selectedPortfolioDetails.description}</Text>

    <Divider my={3} />

    <Text mb={2} weight="medium">
      {COPY['recommendation.title']}
    </Text>

    <Text mb={2}>{AGE_COPY[ageSuggestion]({ age })} </Text>
    <Text>
      {buildRecommendationCopy({
        age: ageSuggestion,
        riskLevel,
        riskComfort,
      })}
    </Text>

    <Divider my={3} />

    <AssetList
      backgroundStyle={styles.assetList}
      items={selectedPortfolioDetails.contents}
    />

    {Env.isProd ? null : (
      <React.Fragment>
        <Divider my={3} />

        <Text mb={2} weight="medium">
          {COPY['historicalPerformance']}
        </Text>

        <PerformanceChart portfolioName={selectedPortfolioDetails.name} />
      </React.Fragment>
    )}
  </ScrollView>
);

PortfolioDetailsView.propTypes = {
  age: PropTypes.number.isRequired,
  ageSuggestion: PropTypes.string.isRequired,
  riskComfort: PropTypes.string.isRequired,
  riskLevel: PropTypes.string.isRequired,
  selectedPortfolioDetails: PropTypes.shape({
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    contents: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        ticker: PropTypes.string,
        weight: PropTypes.number,
      }),
    ),
  }).isRequired,
};

const Component = withDimensions(PortfolioDetailsView);

Component.displayName = 'PortfolioDetailsView';

export default Component;
