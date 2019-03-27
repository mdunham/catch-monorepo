import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Platform,
  View,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';

import {
  Box,
  Text,
  SplitLayout,
  Spinner,
  withDimensions,
  styles,
} from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { timePeriod, goTo, createLogger } from '@catch/utils';

import { HomeStatus, HealthExit } from '../containers';
import {
  HomeTitle,
  NoPlanCard,
  PlanProcessingCard,
  PlanStartedCard,
  NotificationList,
  HomeEmptyIllustration,
  IdVerificationCard,
  BankLinkErrorCard,
  PendingRewardCard,
  AllGoalsPausedCard,
  LockedOutCard,
  GuideCheckupCard,
} from '../components';
import HomeIntroView from './HomeIntroView';

const Log = createLogger('HomeView');

const PREFIX = 'catch.module.home.HomeView';
export const COPY = {
  hiddenDeposits: values => (
    <FormattedMessage id={`${PREFIX}.hiddenDeposits`} values={values} />
  ),
};
const isNative = Platform.OS !== 'web';
export class HomeView extends PureComponent {
  static propTypes = {
    givenName: PropTypes.string,
    match: PropTypes.object,
    push: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.goTo = goTo.bind(this);
  }

  handleReject = item => {
    if (isNative) {
      this.goTo(['/paycheck', '/reject'], {
        paycheckId: item.id,
      });
    } else {
      this.goTo(`/paycheck/${item.id}/reject`);
    }
  };

  handleValidate = (item, workType) => {
    if (workType === 'WORK_TYPE_DIVERSIFIED') {
      if (isNative) {
        this.goTo(['/paycheck', '/triage'], {
          paycheckId: item.id,
        });
      } else {
        this.goTo(`/paycheck/${item.id}/triage`);
      }
    } else {
      if (isNative) {
        this.goTo(['/paycheck', '/breakdown'], {
          paycheckId: item.id,
        });
      } else {
        this.goTo(`/paycheck/${item.id}/breakdown`);
      }
    }
  };

  renderCard = ({ status, bankInfo, rewardAmount }) => {
    const { viewport } = this.props;
    switch (status) {
      case 'BANKLINK_LOGIN_ERROR':
        return (
          <BankLinkErrorCard
            viewport={viewport}
            onContinue={() =>
              this.goTo(['/link-bank'], {
                bankLinkID: bankInfo.bankLinkID,
                bank: bankInfo.primaryBank,
              })
            }
            bankName={bankInfo.primaryBank.name}
            {...bankInfo}
          />
        );
      case 'PLAN_STARTED':
        return (
          <PlanStartedCard
            viewport={viewport}
            onContinue={() => this.goTo(['/plan'])}
          />
        );
      case 'PENDING_REWARD':
      case 'PENDING_REWARD_NO_GOALS':
        return (
          <PendingRewardCard
            viewport={viewport}
            amount={rewardAmount}
            onStart={() => this.goTo(['/plan', '/timeoff', '/intro'])}
          />
        );
      case 'NO_PLAN':
        return (
          <NoPlanCard
            viewport={viewport}
            onStart={() => this.goTo(['/plan'])}
          />
        );
      case 'PLAN_PROCESSING':
        return <PlanProcessingCard />;
      case 'EMPTY':
      case 'NO_NOTIFICATIONS':
        return <HomeEmptyIllustration />;
      case 'NEEDS_IDV':
        return (
          <IdVerificationCard
            viewport={viewport}
            onContinue={() => this.goTo('/plan/upload-identification')}
          />
        );
      case 'ALL_GOALS_PAUSED':
        return (
          <AllGoalsPausedCard
            viewport={viewport}
            onStart={() => this.goTo(['/plan'])}
          />
        );
      case 'LOCKED_OUT':
        const URL = 'https://help.catch.co';
        return (
          <LockedOutCard
            viewport={viewport}
            onStart={() => Linking.openURL(URL)}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { viewport, size, breakpoints, componentId } = this.props;

    const isMobile = viewport === 'PhoneOnly';
    const rightContainer = isMobile
      ? {}
      : {
          pt: 3,
          style: { maxWidth: 375 },
        };
    return (
      <HomeStatus>
        {({
          status,
          surveyStatus,
          notifications,
          hiddenNotifications,
          rewardAmount,
          primaryBank,
          lastBankLinkUpdate,
          bankLinkID,
          loading,
          error,
          workType,
          givenName,
          hasFinishedSurvey,
          healthExitState,
          healthExitOrigin,
          isHealthCovered,
          healthRecID,
          healthInsID,
        }) =>
          loading ? (
            <Box w={1} align="center" pt={120}>
              <Spinner large />
            </Box>
          ) : surveyStatus === 'NO_SURVEY' ? (
            <HomeIntroView push={this.props.push} componentId={componentId} />
          ) : (
            <SafeAreaView style={styles.get('Container')}>
              <ScrollView contentContainerStyle={styles.get('CenterColumn')}>
                <View
                  style={styles.get(
                    ['Container', 'PageMax', 'TopSpace'],
                    viewport,
                  )}
                >
                  <SplitLayout contentContainerStyle={styles.get('FullSize')}>
                    {!!status && (
                      <HomeTitle
                        type={status}
                        name={givenName}
                        isMobile={isMobile}
                        breakpoints={breakpoints}
                        dayTime={timePeriod(new Date().getHours())}
                      />
                    )}
                    <Box {...rightContainer}>
                      <ErrorBoundary Component={ErrorMessage}>
                        <HealthExit
                          goTo={this.goTo}
                          viewport={viewport}
                          recID={healthRecID}
                          insuranceID={healthInsID}
                          exitState={healthExitState}
                          exitOrigin={healthExitOrigin}
                          isCovered={isHealthCovered}
                        >
                          {this.renderCard({
                            status,
                            bankInfo: {
                              primaryBank,
                              lastBankLinkUpdate,
                              bankLinkID,
                            },
                            rewardAmount,
                          })}
                        </HealthExit>
                        {surveyStatus === 'LEGACY_NO_SURVEY' && (
                          <GuideCheckupCard
                            viewport={viewport}
                            onStart={() => this.goTo('/guide')}
                          />
                        )}
                        {!!notifications && (
                          // TODO: we can filter which card we need depending on what
                          // notification type it is, currently we only have income
                          <NotificationList
                            onRejectIncome={this.handleReject}
                            onValidateIncome={item =>
                              this.handleValidate(item, workType)
                            }
                            items={notifications}
                            status={status}
                            viewport={viewport}
                          />
                        )}
                      </ErrorBoundary>
                      {!!hiddenNotifications && (
                        <Text style={{ opacity: 0.5 }} mt={2} center>
                          {COPY['hiddenDeposits']({
                            number: hiddenNotifications,
                          })}
                        </Text>
                      )}
                    </Box>
                  </SplitLayout>
                </View>
              </ScrollView>
            </SafeAreaView>
          )
        }
      </HomeStatus>
    );
  }
}

const withRedux = connect(
  undefined,
  { push },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

export default enhance(HomeView);
