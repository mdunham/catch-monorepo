import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Platform, View, Text } from 'react-native';
import access from 'safe-access';

import {
  PageTitle,
  Divider,
  withDimensions,
  styles as st,
  Modal,
  Button,
} from '@catch/rio-ui-kit';
import { ErrorBoundary, ErrorMessage } from '@catch/errors';
import { navigationPropTypes, Env, getRouteState } from '@catch/utils';
import {
  CatchUpView,
  TransferFundsView,
  WithdrawalModal,
  PlanLayout,
  SetVerticalInterest,
} from '@catch/common';
import { GuideCard } from '@catch/guide/src/components';
import planTypes from '@catch/guide/src/copy';
import { PauseFullPlan, PlanActiveList } from '../containers';
import { TotalCard, AdditionalPlanCard } from '../components';

const PREFIX = 'catch.module.plan.PlanView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.${'title'}`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
};

export class PlanView extends React.Component {
  static propTypes = {
    match: PropTypes.object,
    suggestedPlans: PropTypes.array.isRequired,
    additionalPlans: PropTypes.array.isRequired,
    ...navigationPropTypes,
  };

  constructor(props) {
    super(props);

    this.getRouteState = getRouteState.bind(this);

    this.state = {
      catchUpStep: null,
      goalType: null,
      initialTransferAmount: 0,
      isCatchingUp: false,
      isTransferring: false,
      navigatingFromCatchUp: false,
      transferType: null,
    };
  }

  // on web, only if a user has a BBVA account set up
  // determine if a user should be put into the catchup flow
  // if so, mount the catchup modal
  componentDidMount() {
    const { isSavingsAccountReady } = this.props;

    if (isSavingsAccountReady && Platform.OS === 'web') {
      const showCatchUp = access(this.getRouteState(), 'showCatchUp');

      showCatchUp &&
        setTimeout(() => {
          this.setState({
            isCatchingUp: true,
            goalType: showCatchUp.toUpperCase(),
          });
        }, 2500);
    }
  }

  // toggles the transfer functionality
  toggleTransfer = () => {
    this.setState({ isTransferring: !this.state.isTransferring });
  };

  // from the catchup flow, switch to the transfers flow
  // @TODO: create a PlanContextView that handles context changes from within one modal body
  toggleDepositFromCatchUp = async ({ goalType, initialTransferAmount }) => {
    if (Env.isNative) {
      this.props.goTo('/plan/transfer', {
        goalType,
        initialTransferAmount,
        transferType: 'deposit',
      });
    } else {
      await this.setState({
        isCatchingUp: false,
        catchUpStep: 'config',
        navigatingFromCatchUp: true,
        transferType: 'deposit',
        initialTransferAmount: initialTransferAmount,
        goalType: goalType,
      });

      this.setState({ isTransferring: true });
    }
  };

  // util to toggle catch up functionality in dev env
  toggleCatchUp = goalType => {
    if (Env.isNative) {
      this.props.goTo('/plan/catch-up', {
        step: null,
        goalType,
        toggleDeposit: this.toggleDepositFromCatchUp,
      });
    } else {
      this.setState({ isCatchingUp: !this.state.isCatchingUp, goalType });
    }
  };

  // when a user gets to the first deposit screen after catch up and click "back", they should be directed back to 2nd step of Catch up flow
  toggleBackToCatchUp = async () => {
    await this.setState({ isTransferring: false });
    this.setState({ isCatchingUp: true });
  };

  // dismiss the catchup modal or navigates back to plan
  handleCatchUpDismiss = () => {
    this.setState({
      isCatchingUp: false,
      goalType: null,
    });
    if (Platform.OS === 'web') {
      // Replaces the route state with an empty object on dismiss to make sure
      // the modal doesn't appear again on page reload
      this.props.replace('/plan', {});
    }
  };

  handleLineup = () => {
    this.props.goTo('/plan/coming-soon');
  };

  navigateTransfers = Platform.select({
    web: action =>
      this.setState({ isTransferring: true, transferType: action }),
    default: () => this.props.goTo('/plan/transfer'),
  });

  render() {
    const {
      breakpoints,
      viewport,
      hasGoals,
      confidence,
      hiddenRecommendations,
      refetch,
      activeGoals,
      draftGoals,
      kycStatus,
      overallStatus,
      totalPercent,
      hasAtLeastOneReadyAccount,
      verticalInterest,
      workType,
      isSavingsAccountReady,
      hasAllGoals,
      hasBalance,
      suggestedPlans,
      additionalPlans,
    } = this.props;

    const isMobile = viewport === 'PhoneOnly';
    return (
      <React.Fragment>
        {hasGoals && (
          <View
            style={st.get(
              [
                'FluidContainer',
                'TopSpace',
                'Margins',
                'PageMax',
                'XlBottomGutter',
                'CenterRow',
              ],
              viewport,
            )}
          >
            <View style={st.get(['Flex1'])}>
              <TotalCard
                viewport={viewport}
                total={totalPercent}
                breakdown={activeGoals}
                hasAtLeastOneReadyAccount={hasAtLeastOneReadyAccount}
                onEdit={() => this.props.goTo('/plan/manage')}
              >
                {!isMobile &&
                  hasAtLeastOneReadyAccount && (
                    <View
                      style={st.get(['TopGutter', 'FluidContainer'], viewport)}
                    >
                      <View style={st.get('Flex1')}>
                        <Button
                          onClick={() => this.navigateTransfers('deposit')}
                          type="outline"
                          viewport={viewport}
                          smallText
                        >
                          Deposit funds
                        </Button>
                      </View>
                      {hasBalance && (
                        <View style={st.get(['LeftGutter', 'Flex1'])}>
                          <Button
                            onClick={() => this.navigateTransfers('withdraw')}
                            type="outline"
                            viewport={viewport}
                            smallText
                          >
                            Withdraw funds
                          </Button>
                        </View>
                      )}
                    </View>
                  )}
              </TotalCard>
              {isMobile &&
                hasAtLeastOneReadyAccount && (
                  <View
                    style={st.get([
                      'LgBottomGutter',
                      'CenterColumn',
                      'FullWidth',
                    ])}
                  >
                    <Button
                      onClick={() => this.navigateTransfers(null)}
                      type="outline"
                    >
                      Transfer funds
                    </Button>
                  </View>
                )}
            </View>
            <View
              style={st.get([
                breakpoints.select({
                  TabletLandscapeUp: 'Flex2',
                  'TabletPortraitUp|PhoneOnly': 'Flex1',
                }),
                breakpoints.select({
                  'TabletPortraitUp|TabletLandscapeUp': 'LgLeftGutter',
                }),
              ])}
            >
              {hasGoals && (
                <PlanActiveList
                  goalStates={activeGoals}
                  kycStatus={kycStatus}
                  goTo={this.props.goTo}
                  viewport={viewport}
                />
              )}
            </View>
          </View>
        )}
        <View
          style={st.get([
            'FullWidth',
            'TopGutter',
            hasGoals && 'Gray',
            'CenterColumn',
          ])}
        >
          <View
            style={st.get(
              [
                'FullWidth',
                'PageMax',
                'Margins',
                viewport !== 'PhoneOnly' && 'XlTopGutter',
              ],
              viewport,
            )}
          >
            {hasGoals ? (
              !!suggestedPlans.length && (
                <Text
                  style={st.get(
                    ['H2S', 'BottomGutter', 'XlTopGutter'],
                    viewport,
                  )}
                >
                  Add to plan
                </Text>
              )
            ) : (
              <PageTitle
                isMobile={isMobile}
                light
                title={COPY['title']}
                subtitle={COPY['subtitle']}
                viewport={viewport}
              />
            )}
          </View>
          <View
            style={st.get(
              [
                'FullWidth',
                'Row',
                'Wrap',
                'LgTopGutter',
                'XlBottomGutter',
                'PageMax',
                'Margins',
              ],
              viewport,
            )}
          >
            {suggestedPlans.map(
              ({ id, type, needBasedImportance, importance }, i) => (
                <GuideCard
                  id={id}
                  key={id}
                  index={i}
                  cardType="plan"
                  viewport={viewport}
                  planType={type}
                  title={planTypes[type].title}
                  description={planTypes[type].planDescription}
                  needBasedImportance={needBasedImportance}
                  comingSoon={false}
                  status={needBasedImportance}
                  onPlanStart={path => this.props.goTo(`/plan/${path}/intro`)}
                />
              ),
            )}
          </View>
          <Text
            style={st.get(
              ['Body', 'PageMax', 'FullWidth', 'Margins'],
              viewport,
            )}
          >
            Additional benefits
          </Text>
          <View
            style={st.get(
              [
                'FullWidth',
                'Row',
                'Wrap',
                'LgTopGutter',
                'LgBottomGutter',
                'PageMax',
                'Margins',
              ],
              viewport,
            )}
          >
            {additionalPlans.map(({ type }, i) => (
              <AdditionalPlanCard
                title={planTypes[type].title}
                planType={type}
                viewport={viewport}
                index={i}
                key={type}
              />
            ))}
            <AdditionalPlanCard
              title="More to come"
              planType="PLANTYPE_LINEUP"
              index={additionalPlans.length}
              onClick={this.handleLineup}
              viewport={viewport}
            />
          </View>
        </View>
        {this.state.isTransferring && (
          <WithdrawalModal onRequestClose={this.toggleTransfer}>
            <TransferFundsView
              onBackToCatchUp={
                this.state.navigatingFromCatchUp && this.toggleBackToCatchUp
              }
              refetch={refetch}
              toggleParentModal={this.toggleTransfer}
              planTransferType={this.state.transferType}
              goalType={this.state.goalType}
              initialTransferAmount={this.state.initialTransferAmount}
              {...this.props}
            />
          </WithdrawalModal>
        )}

        {this.state.isCatchingUp && (
          <Modal onRequestClose={this.handleCatchUpDismiss} viewport={viewport}>
            <CatchUpView
              step={this.state.catchUpStep}
              goalType={this.state.goalType}
              toggleDeposit={this.toggleDepositFromCatchUp}
              onDismiss={this.handleCatchUpDismiss}
              {...this.props}
            />
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

const Component = withDimensions(PlanView);

Component.displayName = 'PlanView';

export default Component;
