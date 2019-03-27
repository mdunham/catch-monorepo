import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import access from 'safe-access';
import { connect } from 'react-redux';
import { compose } from 'redux';

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
import { PlanEditLayout, FolioFooter } from '@catch/common';
import {
  goTo,
  goBack,
  navigationPropTypes,
  createLogger,
  calcAgeSuggestion,
} from '@catch/utils';
import { ErrorBoundary, ErrorMessage, toastActions } from '@catch/errors';

import { PortfolioSelectionForm } from '../forms';
import { SelectPortfolio } from '../containers';

import PortfolioDetailsView from './PortfolioDetailsView';

const Log = createLogger('change-portfolio-view');

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
  toastTitle: <FormattedMessage id={`${PREFIX}.successToast.title`} />,
  toastMsg: values => (
    <FormattedMessage id={`${PREFIX}.successToast.msg`} values={values} />
  ),
};
const localStyles = StyleSheet.create({
  assetList: {
    backgroundColor: colors.white,
  },
});

export class ChangePortfolioView extends React.PureComponent {
  static propTypes = {
    ...navigationPropTypes,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
  }
  handleBack = Platform.select({
    web: () => this.goTo('/plan/retirement/overview'),
    default: () => this.goBack(),
  });
  handleCompleted = data => {
    const pfName = access(data, 'upsertRetirementGoal.portfolio.name') || '';
    this.props.popToast({
      type: 'success',
      title: COPY['toastTitle'],
      msg: COPY['toastMsg']({
        name: `${pfName.charAt(0) === 'a' ? 'an ' : 'a '}${pfName}`,
      }),
    });
    this.handleBack();
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
        <SelectPortfolio onCompleted={this.handleCompleted}>
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
              <PlanEditLayout
                planTitle="Retirement"
                planIcon="retirement"
                onCancel={this.handleBack}
                onSave={onUpsert}
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
                <FolioFooter />
              </PlanEditLayout>
            );
          }}
        </SelectPortfolio>
      </ErrorBoundary>
    );
  }
}

const withToast = connect(
  null,
  { popToast: toastActions.popToast },
);

const enhance = compose(
  withDimensions,
  withToast,
);

export default enhance(ChangePortfolioView);
