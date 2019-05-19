import React from 'react';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  H3,
  Text,
  SplitLayout,
  Paper,
  CenterFrame,
  Spinner,
  withDimensions,
  Icon,
  colors,
  styles,
} from '@catch/rio-ui-kit';
import { FlowLayout, FolioFooter } from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';

import { AccountSelectionForm } from '../forms';
import { RetirementFlow, AccountRecommendation } from '../containers';

import { accountTypes } from '../utils';

import AccountSelectionContextView from './AccountSelectionContextView';
import AccountSelectionDetailView from './AccountSelectionDetailView';

const PREFIX = 'catch.module.retirement.AccountSelectionView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  'recommendation.title': (
    <FormattedMessage id={`${PREFIX}.recommendation.title`} />
  ),
  'recommendation.description': values => (
    <FormattedMessage
      id={`${PREFIX}.recommendation.description`}
      values={values}
    />
  ),
  link1: <FormattedMessage id={`${PREFIX}.link1`} />,
  limits: <FormattedMessage id={`${PREFIX}.limits`} />,
  'ROTH_IRA.recommendation.base': (
    <FormattedMessage id={`${PREFIX}.ROTH_IRA.recommendation.base`} />
  ),
  'IRA.recommendation.base': (
    <FormattedMessage id={`${PREFIX}.IRA.recommendation.base`} />
  ),
  'ROTH_IRA.what': <FormattedMessage id={`${PREFIX}.ROTH_IRA.what`} />,
  'IRA.what': <FormattedMessage id={`${PREFIX}.IRA.what`} />,
};

export class AccountSelectionView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);

    this.state = { showAccountDetails: false, showContextDetails: false };
  }

  handleNext = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/estimator']);
  };

  handleBack = async ({ onUpsert }) => {
    await onUpsert();
    this.goTo(['/plan/retirement', '/portfolio']);
  };

  toggleContextDetails = () => {
    this.setState({ showContextDetails: !this.state.showContextDetails });
  };

  toggleAccountDetails = () => {
    this.setState({ showAccountDetails: !this.state.showAccountDetails });
  };

  render() {
    const { viewport, size } = this.props;
    const isMobile = viewport === 'PhoneOnly';

    return (
      <ErrorBoundary Component={ErrorMessage}>
        <RetirementFlow>
          {({ loading, formValues, onUpsert, accountType }) => (
            <AccountRecommendation>
              {({ loading: loadingUser, recommendedAccountType }) => {
                if (loading || loadingUser)
                  return (
                    <CenterFrame>
                      <Spinner large />
                    </CenterFrame>
                  );

                const selectedAccountType =
                  formValues && formValues.accountType
                    ? formValues.accountType
                    : recommendedAccountType;

                return (
                  <FlowLayout
                    footer={<FolioFooter />}
                    onBack={() => this.handleBack({ onUpsert })}
                    onNext={() =>
                      this.handleNext({
                        onUpsert,
                      })
                    }
                    nextButtonText="Choose account"
                    canClickNext={
                      !!formValues &&
                      !!formValues.accountType &&
                      formValues.accountType !== 'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                    }
                  >
                    <View
                      style={styles.get(
                        ['PageWrapper', { minHeight: size.window.height }],
                        viewport,
                      )}
                    >
                      <H3
                        px={isMobile ? 2 : 0}
                        mt={isMobile ? 3 : 0}
                        weight="bold"
                      >
                        {COPY['title']}
                      </H3>

                      <SplitLayout>
                        <Box px={isMobile ? 2 : 0} pb={isMobile ? 4 : 0}>
                          <Text mt={1} mb={isMobile ? 3 : 4}>
                            {COPY['subtitle']}
                          </Text>
                          <AccountSelectionForm
                            accountTypes={accountTypes}
                            initialValues={{
                              accountType:
                                accountType === 'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                  ? recommendedAccountType
                                  : accountType,
                            }}
                            recommendedAccountType={recommendedAccountType}
                            selectedAccountType={selectedAccountType}
                            viewport={viewport}
                            isMobile={isMobile}
                            infoComponent={
                              <AccountSelectionDetailView
                                toggleLimits={this.toggleAccountDetails}
                                showLimits={isMobile}
                                description={
                                  selectedAccountType &&
                                  selectedAccountType !==
                                    'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                    ? accountTypes[selectedAccountType]
                                        .description
                                    : accountTypes[recommendedAccountType]
                                        .description
                                }
                                label={
                                  selectedAccountType &&
                                  selectedAccountType !==
                                    'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                    ? accountTypes[selectedAccountType].label
                                    : accountTypes[recommendedAccountType].label
                                }
                                selectedAccountType={selectedAccountType}
                                what={
                                  selectedAccountType &&
                                  selectedAccountType !==
                                    'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                    ? COPY[`${selectedAccountType}.what`]
                                    : COPY[`${recommendedAccountType}.what`]
                                }
                                why={
                                  selectedAccountType &&
                                  selectedAccountType !==
                                    'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                    ? COPY[
                                        `${selectedAccountType}.recommendation.base`
                                      ]
                                    : COPY[
                                        `${recommendedAccountType}.recommendation.base`
                                      ]
                                }
                                isMobile={isMobile}
                              />
                            }
                          />
                          <Box pt={isMobile ? 2 : 0} row>
                            <Box style={{ marginTop: 4 }}>
                              <Icon
                                name="right"
                                stroke={colors['charcoal--light2']}
                                fill={colors['charcoal--light2']}
                                dynamicRules={{
                                  paths: {
                                    fill: colors['charcoal--light2'],
                                  },
                                }}
                                size={Platform.select({
                                  web: 10,
                                  default: 16,
                                })}
                                style={
                                  this.state.showContextDetails
                                    ? { transform: [{ rotate: '90deg' }] }
                                    : undefined
                                }
                                onClick={this.toggleContextDetails}
                              />
                            </Box>
                            <Text
                              ml={1}
                              color="charcoal--light2"
                              size="small"
                              weight="medium"
                              onClick={this.toggleContextDetails}
                            >
                              Factors informing this recommendation
                            </Text>
                          </Box>

                          <AccountSelectionContextView
                            showContextDetails={this.state.showContextDetails}
                          />
                        </Box>
                        {!isMobile && (
                          <Paper flat p={4}>
                            <AccountSelectionDetailView
                              toggleLimits={this.toggleAccountDetails}
                              showLimits={this.state.showAccountDetails}
                              description={
                                selectedAccountType &&
                                selectedAccountType !==
                                  'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                  ? accountTypes[selectedAccountType]
                                      .description
                                  : accountTypes[recommendedAccountType]
                                      .description
                              }
                              label={
                                selectedAccountType &&
                                selectedAccountType !==
                                  'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                  ? accountTypes[selectedAccountType].label
                                  : accountTypes[recommendedAccountType].label
                              }
                              selectedAccountType={selectedAccountType}
                              what={
                                selectedAccountType &&
                                selectedAccountType !==
                                  'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                  ? COPY[`${selectedAccountType}.what`]
                                  : COPY[`${recommendedAccountType}.what`]
                              }
                              why={
                                selectedAccountType &&
                                selectedAccountType !==
                                  'UNKNOWN_WEALTH_ACCOUNT_TYPE'
                                  ? COPY[
                                      `${selectedAccountType}.recommendation.base`
                                    ]
                                  : COPY[
                                      `${recommendedAccountType}.recommendation.base`
                                    ]
                              }
                              isMobile={isMobile}
                            />
                          </Paper>
                        )}
                      </SplitLayout>
                    </View>
                  </FlowLayout>
                );
              }}
            </AccountRecommendation>
          )}
        </RetirementFlow>
      </ErrorBoundary>
    );
  }
}

export default withDimensions(AccountSelectionView);
