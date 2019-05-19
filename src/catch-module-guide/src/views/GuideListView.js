import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, Platform, SafeAreaView } from 'react-native';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

import { withDimensions, styles, Icon } from '@catch/rio-ui-kit';
import { goTo, Segment } from '@catch/utils';
import { SetVerticalInterest } from '@catch/common';

import { updateActedOnCache, GuideProgress } from '../containers';
import { GuideCard } from '../components';
import { guideActions, guideSelectors } from '../store';
import GuideInfoView from './GuideInfoView';

import planTypes from '../copy';
import UnpausePlanView from './UnpausePlanView';
import AdjustTaxesView from './AdjustTaxesView';

const updateViews = {
  UnpausePlanView,
  AdjustTaxesView,
};

export function guideList(data) {
  if (!Array.isArray(data)) {
    return {
      topList: [],
      bottomList: [],
      recCount: 0,
      coveredCount: 0,
    };
  }
  const weights = {
    VITAL: 6,
    IMPORTANT: 5,
    CONTRIBUTING: 4,
    PAUSED: 4,
    COVERED: 3,
    CONSIDER: 2,
    NONE: 1,
  };
  const topFlags = ['VITAL', 'IMPORTANT', 'COVERED', 'CONTRIBUTING', 'PAUSED'];
  const coveredFlags = ['COVERED', 'CONTRIBUTING', 'PAUSED'];
  let coveredCount = 0;

  function selectSortImportance(item) {
    if (item.importance === 'NONE' || item.importance === 'IMPORTANT') {
      return item.needBasedImportance;
    }
    return item.importance;
  }
  function sortImportance(a, b) {
    return weights[selectSortImportance(b)] - weights[selectSortImportance(a)];
  }

  const topList = data
    .reduce((list, item) => {
      if (topFlags.includes(item.importance)) {
        // Iterate the count of covered items while we reduce
        if (coveredFlags.includes(item.importance)) {
          coveredCount++;
        }
        return [...list, item];
      }
      return list;
    }, [])
    .sort(sortImportance);

  const bottomList = data
    .reduce((list, item) => {
      if (!topFlags.includes(item.importance)) {
        return [...list, item];
      }
      return list;
    }, [])
    .sort(sortImportance);

  const recCount = topList.length;

  return {
    topList,
    bottomList,
    recCount,
    coveredCount,
  };
}

export class GuideListView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      selectedInfo: null,
    };
  }
  handleSelect = item => {
    Segment.guideCardOpened(item.type);

    if (Platform.OS === 'web') {
      if (planTypes[item.type].caption) {
        this.props.showGuideInfoModal(item);
      }
      // In native the info view has its own nav screen
    } else {
      const { type } = item;
      this.goTo('/guide/info', {
        ...item,
        title: planTypes[type].title,
        p1: planTypes[type].p1,
        p2: planTypes[type].p2,
        caption: planTypes[type].caption,
        onstart: this.props.onPlanStart,
      });
    }
  };
  handleDismiss = () => {
    this.props.hideGuideInfoModal();
  };
  handleCheckup = () => {
    this.goTo('/guide/checkup');
  };
  handlePlanDetails = plan => {
    this.goTo(`/plan/${plan}/overview`);
  };
  handlePlanStart = plan => {
    this.goTo(`/plan/${plan}/intro`);
  };
  handleUpdates = updates => {
    if (Platform.OS === 'web') {
      this.props.loadPlanUpdates(updates);
    } else {
      // Initialize the first view index here,
      // GuideUpdatesView will do the rest
      this.goTo('/guide/updates', {
        ...this.props,
        // @WARNING: updates and updateIndex are already in the props
        // We override here to avoid using redux in native
        updates,
        updateIndex: 0,
      });
    }
  };
  renderInfoModal = () => {
    const {
      selectedInfo: {
        id,
        type,
        reason,
        disabled,
        importance,
        isInterested,
        needBasedImportance,
        secondary,
      },
    } = this.props;
    return (
      <GuideInfoView
        id={id}
        type={type}
        importance={importance}
        p1={planTypes[type].p1}
        p2={planTypes[type].p2}
        isInterested={isInterested}
        title={planTypes[type].title}
        caption={planTypes[type].caption}
        needBasedImportance={needBasedImportance}
        onStart={this.handlePlanStart}
        onDismiss={this.handleDismiss}
        secondary={secondary}
        disabled={disabled}
        reason={reason}
      />
    );
  };
  renderUpdatesModal = () => {
    const {
      updates,
      updateIndex,
      // For tax adjustments only
      currentRate,
      currentEstimate,
      suggestedRate,
      suggestedEstimate,
    } = this.props;
    const currentUpdate = updates[updateIndex];
    const UpdateView = updateViews[currentUpdate.view];
    return (
      <UpdateView
        planType={currentUpdate.planType}
        onCancel={this.handleNextUpdate}
        onCompleted={this.handleNextUpdate}
        currentRate={currentRate}
        currentEstimate={currentEstimate}
        suggestedRate={suggestedRate}
        suggestedEstimate={suggestedEstimate}
      />
    );
  };
  handleNextUpdate = () => {
    const {
      updates,
      updateIndex,
      nextPlanUpdate,
      resetPlanUpdates,
    } = this.props;
    const nextUpdate = updates[updateIndex + 1];
    if (nextUpdate) {
      nextPlanUpdate();
    } else {
      const { recId } = updates[updateIndex];
      this.props.setIsActedOn({
        variables: {
          input: {
            recommendationID: recId,
            isActedOn: true,
          },
        },
        update: updateActedOnCache(recId),
      });
      resetPlanUpdates();
    }
  };
  render() {
    const { data, viewport, size, breakpoints } = this.props;

    const { topList, bottomList, recCount, coveredCount } = guideList(data);
    return (
      <SafeAreaView style={styles.get('Flex1')}>
        <ScrollView>
          <View
            accessibilityLabel="Recommended benefits"
            style={styles.get(
              [
                'FullWidth',
                'CenterColumn',
                'TopSpace',
                { zIndex: 10, minHeight: 460 },
              ],
              viewport,
            )}
          >
            <View
              style={styles.get(
                [
                  'Margins',
                  'FullWidth',
                  'PageMax',
                  breakpoints.select({
                    'TabletLandscapeUp|TabletPortraitUp': 'XlBottomGutter',
                  }),
                  { zIndex: 20 },
                ],
                viewport,
              )}
            >
              <View style={styles.get(['Bilateral'])}>
                <Text style={styles.get(['H2S', 'BottomGutter'], viewport)}>
                  Your Coverage
                </Text>
                {!!topList.length && (
                  <View
                    style={styles.get([
                      breakpoints.select({
                        'TabletPortraitUp|TabletLandscapeUp': 'LgTopGutter',
                      }),
                    ])}
                  >
                    <GuideProgress
                      viewport={viewport}
                      coveredCount={coveredCount}
                      recCount={recCount}
                      items={topList}
                      onPlanDetails={this.handlePlanDetails}
                      onPlanStart={this.handlePlanStart}
                      onUpdates={this.handleUpdates}
                      onInfo={this.handleSelect}
                    />
                    {breakpoints.select({
                      'TabletPortraitUp|TabletLandscapeUp': (
                        <Text
                          style={styles.get(['H6', 'XlTopGutter'], viewport)}
                        >
                          {coveredCount} OF {recCount} COVERED
                        </Text>
                      ),
                    })}
                  </View>
                )}
              </View>
              {topList.length ? (
                <Text style={styles.get(['Body', 'ContentMax'], viewport)}>
                  We recommend prioritizing these benefits to build a stable
                  base now and for the future.
                </Text>
              ) : (
                <View style={styles.get('XlBottomGutter')}>
                  <Text
                    style={styles.get(
                      ['Body', 'ContentMax', 'LgBottomGutter'],
                      viewport,
                    )}
                  >
                    When life changes, your needs may too. Take the checkup
                    again to revisit your benefits recommendations.
                  </Text>
                  <Text
                    onPress={this.handleCheckup}
                    style={styles.get(['BodyLink', 'XlBottomGutter'], viewport)}
                  >
                    Revisit recommendations
                  </Text>
                </View>
              )}
            </View>
            <View
              style={styles.get(
                [
                  'PageMax',
                  'FullWidth',
                  'Row',
                  'Wrap',
                  'LgTopGutter',
                  'Margins',
                ],
                viewport,
              )}
            >
              {topList.map(
                (
                  {
                    id,
                    type,
                    importance,
                    isInterested,
                    needBasedImportance,
                    contribution,
                    comingSoon,
                    disabled,
                    balance,
                    reason,
                    updates,
                    carrier,
                    doctors,
                  },
                  i,
                ) => (
                  <GuideCard
                    id={id}
                    key={id}
                    index={i}
                    viewport={viewport}
                    planType={type}
                    title={planTypes[type].title}
                    description={planTypes[type].description}
                    needBasedImportance={needBasedImportance}
                    contribution={contribution}
                    comingSoon={comingSoon}
                    status={importance}
                    disabled={disabled}
                    balance={balance}
                    updates={updates}
                    onClick={() =>
                      this.handleSelect({
                        id,
                        type,
                        disabled,
                        importance,
                        isInterested,
                        needBasedImportance,
                        reason,
                      })
                    }
                    onPlanDetails={this.handlePlanDetails}
                    onPlanStart={this.handlePlanStart}
                    onUpdates={this.handleUpdates}
                    doctors={doctors}
                    carrier={carrier}
                  />
                ),
              )}
            </View>
          </View>
          {// Only render the bottom list if there are items to show
          !!bottomList.length && (
            <View
              accessibilityLabel="Additional benefits"
              style={styles.get([
                'FullWidth',
                'CenterColumn',
                'Gray',
                'Flex1',
                { marginTop: -100, paddingTop: 124 },
              ])}
            >
              <View
                style={styles.get(
                  [
                    'FullWidth',
                    'PageMax',
                    'XlBottomGutter',
                    'XlTopGutter',
                    'Margins',
                  ],
                  viewport,
                )}
              >
                <Text style={styles.get(['H2S', 'BottomGutter'], viewport)}>
                  Additional Coverage
                </Text>
                <Text style={styles.get(['Body', 'ContentMax'], viewport)}>
                  These additional benefits may be helpful for you and your
                  family.
                </Text>
              </View>
              {breakpoints.select({
                'TabletLandscapeUp|TabletPortraitUp': (
                  <View
                    style={styles.get(
                      [
                        'PageMax',
                        'Row',
                        'Wrap',
                        'FullWidth',
                        'LgTopGutter',
                        'XlBottomGutter',
                        'Margins',
                      ],
                      viewport,
                    )}
                  >
                    {bottomList.map(
                      (
                        {
                          id,
                          type,
                          isInterested,
                          needBasedImportance,
                          importance,
                          disabled,
                          reason,
                          comingSoon,
                        },
                        i,
                      ) => (
                        <GuideCard
                          id={id}
                          key={id}
                          index={i}
                          viewport={viewport}
                          planType={type}
                          status={importance}
                          title={planTypes[type].title}
                          description={planTypes[type].description}
                          needBasedImportance={needBasedImportance}
                          onPlanStart={this.handlePlanStart}
                          comingSoon={comingSoon}
                          disabled={disabled}
                          onClick={() =>
                            this.handleSelect({
                              id,
                              type,
                              disabled,
                              importance,
                              isInterested,
                              needBasedImportance,
                              reason,
                              secondary: true,
                            })
                          }
                          secondary
                        />
                      ),
                    )}
                  </View>
                ),
                PhoneOnly: (
                  <ScrollView
                    horizontal
                    style={styles.get('FullWidth')}
                    contentContainerStyle={styles.get('Margins', 'PhoneOnly')}
                  >
                    {bottomList.map(
                      (
                        {
                          id,
                          type,
                          isInterested,
                          needBasedImportance,
                          importance,
                          disabled,
                          reason,
                          comingSoon,
                        },
                        i,
                      ) => (
                        <GuideCard
                          id={id}
                          key={id}
                          index={i}
                          viewport={viewport}
                          planType={type}
                          status={importance}
                          title={planTypes[type].title}
                          description={planTypes[type].description}
                          needBasedImportance={needBasedImportance}
                          onPlanStart={this.handlePlanStart}
                          comingSoon={comingSoon}
                          disabled={disabled}
                          horizontal
                          onClick={() =>
                            this.handleSelect({
                              id,
                              type,
                              disabled,
                              importance,
                              isInterested,
                              needBasedImportance,
                              reason,
                              secondary: true,
                            })
                          }
                          secondary
                        />
                      ),
                    )}
                  </ScrollView>
                ),
              })}
            </View>
          )}
        </ScrollView>
        {!!this.props.selectedInfo && this.renderInfoModal()}
        {!!this.props.updates[this.props.updateIndex] &&
          this.renderUpdatesModal()}
      </SafeAreaView>
    );
  }
}

const withRedux = connect(
  createStructuredSelector({
    selectedInfo: guideSelectors.getGuideInfoModal,
    updates: guideSelectors.getUpdates,
    updateIndex: guideSelectors.getUpdateIndex,
  }),
  guideActions,
);

const enhance = compose(
  withRedux,
  withDimensions,
);

const Component = enhance(GuideListView);

Component.displayName = 'GuideListView';

export default Component;
