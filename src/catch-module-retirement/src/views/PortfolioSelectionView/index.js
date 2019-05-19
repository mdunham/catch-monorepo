import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  H3,
  Text,
  Paper,
  SplitLayout,
  CenterFrame,
  Spinner,
  colors,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import { FlowLayout, FolioFooter } from '@catch/common';
import {
  goTo,
  navigationPropTypes,
  createLogger,
  calcAgeSuggestion,
} from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { PortfolioSelectionForm } from '../../forms';
import { SelectPortfolio } from '../../containers';

import PortfolioDetailsView from '../PortfolioDetailsView';

const Log = createLogger('portfolio-selection-view');

const PREFIX = 'catch.module.retirement.PortfolioSelectionView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  selectionTitle: <FormattedMessage id={`${PREFIX}.selectionTitle`} />,
  selectionSubtitle: <FormattedMessage id={`${PREFIX}.selectionSubtitle`} />,
  'recommendation.title': (
    <FormattedMessage id={`${PREFIX}.recommendation.title`} />
  ),
  'recommendation.description': values => (
    <FormattedMessage
      id={`${PREFIX}.recommendation.description`}
      values={values}
    />
  ),
};
const localStyles = StyleSheet.create({
  assetList: {
    backgroundColor: colors.white,
  },
});

export class PortfolioSelectionView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handleNext = async ({ onUpsert }) => {
    const oneOff =
      this.props.location &&
      this.props.location.state &&
      !!this.props.location.state.nextPath;

    try {
      await onUpsert();

      if (oneOff) {
        this.goTo(this.props.location.state.nextPath);
      } else {
        // @TODO: add toast
        this.goTo(['/plan/retirement', '/account']);
      }
    } catch (e) {
      Log.error(e);
    }
  };

  handleBack = async ({ onUpsert }) => {
    const oneOff =
      this.props.location &&
      this.props.location.state &&
      !!this.props.location.state.nextPath;

    try {
      if (oneOff) {
        this.goTo(this.props.location.state.nextPath);
      } else {
        await onUpsert();
        this.goTo(['/plan/retirement', '/risk-level']);
      }
    } catch (e) {
      Log.error(e);
    }
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    // if this is a oneOff version of the screen
    const oneOff =
      this.props.location &&
      this.props.location.state &&
      !!this.props.location.state.nextPath;

    return (
      <ErrorBoundary Component={ErrorMessage}>
        <SelectPortfolio>
          {({
            age,
            loading,
            onUpsert,
            formValues,
            recommendedPortfolio,
            portfolios,
            portfolioID,
            allPortfolioDetails,
            selectedPortfolio,
            selectedPortfolioDetails,
            riskLevel,
            riskComfort,
            ...rest
          }) => {
            if (loading)
              return (
                <CenterFrame>
                  <Spinner large />
                </CenterFrame>
              );

            const ageSuggestion = calcAgeSuggestion({ age });

            return (
              <FlowLayout
                onBack={() =>
                  this.handleBack({
                    onUpsert,
                  })
                }
                onNext={() =>
                  this.handleNext({
                    onUpsert,
                  })
                }
                canClickNext={formValues && !!formValues.portfolioID}
                nextButtonText="Choose portfolio"
                footer={<FolioFooter />}
              >
                <View style={styles.get(['PageWrapper'], viewport)}>
                  <H3 px={isMobile ? 2 : 0} mt={isMobile ? 3 : 0} weight="bold">
                    {COPY['selectionTitle']}
                  </H3>

                  <SplitLayout>
                    <Box
                      px={isMobile ? 2 : 0}
                      pb={4}
                      style={{ minHeight: size.window.height }}
                    >
                      <Text mt={1} mb={isMobile ? 3 : 4}>
                        {COPY['selectionSubtitle']}
                      </Text>
                      <PortfolioSelectionForm
                        portfolios={portfolios}
                        selectedPortfolio={selectedPortfolio}
                        selectedPortfolioDetails={selectedPortfolioDetails}
                        portfolioDetails={allPortfolioDetails}
                        recommendedPortfolio={recommendedPortfolio}
                        initialValues={{
                          portfolioID: portfolioID || recommendedPortfolio.id,
                        }}
                        isMobile={isMobile}
                        viewport={this.props.viewport}
                        infoComponent={
                          <PortfolioDetailsView
                            age={age}
                            ageSuggestion={ageSuggestion}
                            selectedPortfolioDetails={selectedPortfolioDetails}
                            riskComfort={riskComfort}
                            riskLevel={riskLevel}
                          />
                        }
                      />
                    </Box>
                    {!isMobile && (
                      <Paper flat p={4}>
                        <PortfolioDetailsView
                          age={age}
                          ageSuggestion={ageSuggestion}
                          selectedPortfolioDetails={selectedPortfolioDetails}
                          riskComfort={riskComfort}
                          riskLevel={riskLevel}
                        />
                      </Paper>
                    )}
                  </SplitLayout>
                </View>
              </FlowLayout>
            );
          }}
        </SelectPortfolio>
      </ErrorBoundary>
    );
  }
}

export default withDimensions(PortfolioSelectionView);
