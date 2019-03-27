import React from 'react';
import {
  View,
  ScrollView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Dot,
  Box,
  Tabs,
  Tab,
  Text,
  colors,
  TabList,
  TabPanel,
  TabPanels,
  PageWrapper,
  withDimensions,
  SegmentedControl,
  ActionSheet,
  Divider,
  space,
  styles,
  Spinner,
} from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { goTo } from '@catch/utils';

import { PlanStatus, UpdateConfidence, PauseFullPlan } from '../containers';
import { PlanView, PlanHistoryView, PlanIntroView } from '../views';

const PREFIX = 'catch.module.plan.PlanTabs';
export const COPY = {};

export class PlanTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isASVisible: false,
      legacySkippedCheckup: false,
    };
    this.goTo = goTo.bind(this);
  }
  handleSkip = () => {
    this.setState({
      legacySkippedCheckup: true,
    });
  };
  handleActionSheet = () => {
    this.setState(state => ({ isASVisible: !state.isASVisible }));
  };
  /* Returns a function to trigger with an action sheet option */
  createAction = (idx, cb) => {
    const actions = [
      () => {
        this.handleActionSheet();
        this.goTo(['/plan/manage']);
      },
      () => {
        this.handleActionSheet();
        this.goTo(['/plan/transfer'], {
          planTransferType: 'deposit',
          goalType: null,
        });
      },
      () => {
        this.handleActionSheet();
        this.goTo(['/plan/transfer'], {
          planTransferType: 'withdraw',
          goalType: null,
        });
      },
    ];
    return actions[idx];
  };
  render() {
    const { legacySkippedCheckup } = this.state;
    const { viewport } = this.props;
    const isMobile = viewport === 'PhoneOnly';
    const isNative = Platform.OS !== 'web';

    return (
      <PlanStatus>
        {planStatus => {
          const {
            loading,
            error,
            hasConfidence,
            hasBalance,
            overallStatus,
            hasGoals,
            refetch,
            workType,
            hasDiversifiedIncomeHistory,
            hasFinishedSurvey,
            isSavingsAccountReady,
          } = planStatus;
          return loading ? (
            <Box w={1} align="center" pt={120}>
              <Spinner large />
            </Box>
          ) : // Either a use does not have confidence then they are not legacy
          // else they need to skip this message of answer the survey to access their
          // plan view
          (!hasFinishedSurvey && !hasConfidence) ||
          (!hasFinishedSurvey && hasConfidence && !legacySkippedCheckup) ? (
            <PlanIntroView
              legacy={hasConfidence}
              onSkipCheckup={this.handleSkip}
              {...this.props}
            />
          ) : (
            <SafeAreaView style={styles.get('Container')}>
              {isNative &&
                hasGoals && (
                  <Box
                    style={{
                      width: '100%',
                      height: 54,
                      backgroundColor: colors.white,
                      zIndex: 100,
                    }}
                    pb={1}
                    align="flex-end"
                    justify="center"
                  >
                    <TouchableOpacity
                      onPress={this.handleActionSheet}
                      style={{ padding: 24 }}
                    >
                      <Box align="center">
                        <Dot color="primary" size={4} m={1.5} />
                        <Dot color="primary" size={4} m={1.5} />
                        <Dot color="primary" size={4} m={1.5} />
                      </Box>
                    </TouchableOpacity>
                  </Box>
                )}
              <ScrollView contentContainerStyle={styles.get('CenterColumn')}>
                <View style={styles.get(['Container'], viewport)}>
                  {hasGoals ? (
                    isNative ? (
                      <SegmentedControl
                        style={styles.get(['Margins', 'TopGutter'], viewport)}
                        key="segments"
                        controls={[
                          { title: 'My Plan' },
                          { title: 'Plan History' },
                        ]}
                      >
                        <ErrorBoundary Component={ErrorMessage}>
                          <PlanView
                            {...this.props}
                            {...planStatus}
                            goTo={this.goTo}
                          />
                        </ErrorBoundary>
                        <ErrorBoundary Component={ErrorMessage}>
                          <PlanHistoryView
                            {...this.props}
                            isMobile={isMobile}
                            workType={workType}
                            hasDiversifiedIncomeHistory={
                              hasDiversifiedIncomeHistory
                            }
                          />
                        </ErrorBoundary>
                      </SegmentedControl>
                    ) : (
                      <Tabs style={styles.get(['CenterColumn', 'FullWidth'])}>
                        <TabList
                          style={styles.get(
                            ['FullWidth', 'PageMax', 'Margins', 'LgTopGutter'],
                            viewport,
                          )}
                        >
                          <Tab>My Plan</Tab>
                          <Tab disabled={!hasGoals}>Plan History</Tab>
                        </TabList>
                        <TabPanels style={styles.get('FullWidth')}>
                          <TabPanel
                            style={styles.get(['FullWidth', 'CenterColumn'])}
                          >
                            <ErrorBoundary Component={ErrorMessage}>
                              <PlanView
                                {...this.props}
                                {...planStatus}
                                goTo={this.goTo}
                              />
                            </ErrorBoundary>
                          </TabPanel>
                          <TabPanel
                            style={styles.get(['FullWidth', 'CenterColumn'])}
                          >
                            <ErrorBoundary Component={ErrorMessage}>
                              <PlanHistoryView
                                {...this.props}
                                isMobile={isMobile}
                                workType={workType}
                                hasDiversifiedIncomeHistory={
                                  hasDiversifiedIncomeHistory
                                }
                              />
                            </ErrorBoundary>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    )
                  ) : (
                    <ErrorBoundary Component={ErrorMessage}>
                      <PlanView
                        {...this.props}
                        {...planStatus}
                        goTo={this.goTo}
                      />
                    </ErrorBoundary>
                  )}
                </View>
              </ScrollView>
              {isNative && (
                <ActionSheet
                  display={this.state.isASVisible}
                  onRequestClose={this.handleActionSheet}
                  height={hasBalance ? 250 : 220}
                >
                  <Box p={2}>
                    <Text my={2} weight="medium" color="charcoal--light3">
                      Plan options
                    </Text>
                    <Divider mb={2} />
                    <TouchableOpacity onPress={this.createAction(0)}>
                      <Text color="link" weight="medium" size="small" mb={2}>
                        Edit plan
                      </Text>
                    </TouchableOpacity>

                    {isSavingsAccountReady && (
                      <React.Fragment>
                        <Divider mb={2} />
                        <TouchableOpacity onPress={this.createAction(1)}>
                          <Text
                            color="link"
                            weight="medium"
                            size="small"
                            mb={2}
                          >
                            Deposit funds
                          </Text>
                        </TouchableOpacity>
                        {hasBalance && (
                          <React.Fragment>
                            <Divider mb={2} />
                            <TouchableOpacity onPress={this.createAction(2)}>
                              <Text
                                color="link"
                                weight="medium"
                                size="small"
                                mb={2}
                              >
                                Withdraw funds
                              </Text>
                            </TouchableOpacity>
                          </React.Fragment>
                        )}
                      </React.Fragment>
                    )}
                  </Box>
                </ActionSheet>
              )}
            </SafeAreaView>
          );
        }}
      </PlanStatus>
    );
  }
}

export default withDimensions(PlanTabs);
