import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import access from 'safe-access';

import {
  styles as st,
  withDimensions,
  Figure,
  Spinner,
  Button,
  colors,
} from '@catch/rio-ui-kit';
import { Currency, goTo, goBack, getRouteState } from '@catch/utils';

import {
  Page,
  HealthPlanPreviewCard,
  SavingsInfoCard,
  CsrInfoCard,
  HealthNavBar,
  DetailBottomBar,
} from '../components';
import { HealthPlans } from '../containers';
import HealthPlanDetailView from './HealthPlanDetailView';

const PREFIX = 'catch.health.HealthPlanListView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: values => (
    <FormattedMessage id={`${PREFIX}.subtitle`} values={values} />
  ),
  emptyTitle: <FormattedMessage id={`${PREFIX}.emptyTitle`} />,
  emptySubtitle: <FormattedMessage id={`${PREFIX}.emptySubtitle`} />,
  resetLink: <FormattedMessage id={`${PREFIX}.resetLink`} />,
  loadingMessage: <FormattedMessage id={`${PREFIX}.loadingMessage`} />,
  submitButton: (
    <FormattedMessage id="catch.health.HealthPlanDetailPage.submitButton" />
  ),
};

const defaultFilters = {
  hmo: false,
  epo: false,
  ppo: false,
  premium: 0,
  catastrophic: false,
  bronze: false,
  silver: false,
  gold: false,
  platinum: false,
};

export class HealthPlanListView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.goBack = goBack.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.state = {
      selectedPlan: null,
      scrollOffset: 0,
      scrollEnabled: true,
      showFilter: null,
      activeFilters: [],
      filters: defaultFilters,
    };
  }
  componentDidMount() {
    // Only show the filter bar in mobile
    if (this.scrollContainer && this.props.viewport === 'PhoneOnly') {
      this.scrollContainer.scrollTo({ y: 64, animated: false });
    }
  }
  handleInitialPlanDetails = data => {
    const params = Platform.select({
      web: this.props.match && this.props.match.params,
      default: this.getRouteState(),
    });
    if (params && params.planID && !this.state.selectedPlan) {
      if (this.props.viewport === 'TabletLandscapeUp') {
        this.handleHideNavBar();
      }
      this.setState({
        selectedPlan: params.planID,
      });
      const targetIndex = access(data, 'healthPlans.plans.findIndex()', [
        el => el.id === params.planID,
      ]);
      if (targetIndex >= 0 && this.flatList) {
        this.flatList.scrollToIndex({
          index: targetIndex,
          viewOffset: -324,
          animated: false,
        });
      }
    }
  };
  handleActiveFilters = activeFilters => {
    // Send anything other than array to reset the filters
    if (!Array.isArray(activeFilters)) {
      return this.setState({
        activeFilters: [],
        filters: defaultFilters,
      });
    }
    this.setState({ activeFilters });
    this.handleFilterCard(false);
  };
  // Handles which filter card is visible
  // If a card is visible, the scrolling should be disabled
  handleFilterCard = card => {
    this.setState({
      scrollEnabled: !card,
      showFilter: card,
    });
  };
  // Manages the state for which plan is selected from the list
  // and displayed in the detail view
  handleSelect = idx => {
    if (Platform.OS !== 'web') {
      this.goTo('/plan/health/plans/details', { planID: idx });
      return;
    }
    const { viewport } = this.props;
    if (viewport === 'TabletLandscapeUp') {
      this.handleHideNavBar();
    }
    if (!idx) {
      this.goTo('/plan/health/plans');
    }
    // Although we could use the route params as store for the
    // plan ID I like to keep the state as a proxy to keep finer
    // control over the transitions
    // this.goTo(`/plan/health/plans/${idx}`);
    this.setState({
      selectedPlan: idx,
    });
  };
  // This is toggles the top bar when a user scrolls down and
  // reveals it when they scroll up
  handleScroll = e => {
    if (Platform.OS !== 'web') return;
    const {
      nativeEvent: {
        contentOffset: { y },
      },
    } = e;
    const diff = y - this.state.scrollOffset;
    if (diff > 0) {
      // We are scrolling down
      this.scrollContainer.scrollToEnd({ animated: true });
    } else if (diff < 0) {
      // We are scrolling up
      this.scrollContainer.scrollTo({ y: 64, animated: true });
    } else {
      return;
    }
    this.setState({
      scrollOffset: e.nativeEvent.contentOffset.y,
    });
  };
  // Hide the navBar by scrolling the first container down
  handleHideNavBar = () => {
    if (this.scrollContainer) {
      this.scrollContainer.scrollTo({ y: 122, animated: true });
    }
  };
  // Manages the state of each filter by passing the name of the
  // filter and new value to assign
  handleFilter = (name, value) => {
    this.setState({
      filters: {
        ...this.state.filters,
        [name]: value,
      },
    });
  };
  // Method for the detached bottom bar action
  handleCompleted = () => {
    this.goTo('/plan/health/enroll');
  };
  // Renders a list item, the data is already
  // formatted in the HealthPlans Query container
  renderItem = ({ item }) => (
    <HealthPlanPreviewCard
      viewport={this.props.viewport}
      selectedPlan={this.state.selectedPlan}
      onSelect={this.handleSelect}
      {...item}
    />
  );
  // Renders a header at the top of the list
  // Header should not render is the list empty component is showing
  renderHeader = ({ total, monthlySavings, hasCSR }) => {
    const { viewport } = this.props;
    return (
      <View style={st.get(['BottomGutter'])}>
        <Text style={st.get(['H3'], viewport)}>{COPY['title']}</Text>
        <Text style={st.get(['Body', 'TopGutter', 'LgBottomGutter'], viewport)}>
          {COPY['subtitle']({
            totalPlans: (
              <Text style={st.get(['Body', 'Bold'], viewport)}>{total}</Text>
            ),
          })}
        </Text>
        {!!monthlySavings && (
          <SavingsInfoCard
            viewport={viewport}
            monthlySavings={monthlySavings}
          />
        )}
        {hasCSR && <CsrInfoCard viewport={viewport} />}
      </View>
    );
  };
  renderFooter = Platform.select({
    web: undefined,
    default: () => <View style={styles.listFooter} />,
  });
  // Renders the list based on the result of the query
  // Using a function bound to the pure component improves performance
  // drastically
  renderList = ({
    loading,
    plans,
    filteredPlans,
    total,
    monthlySavings,
    hasCSR,
  }) => {
    const {
      viewport,
      size: {
        window: { height },
      },
      push,
    } = this.props;

    const isFetching = loading && !filteredPlans.length;

    const list = (
      <React.Fragment>
        <HealthNavBar
          plans={plans}
          goTo={this.goTo}
          onBack={this.goBack}
          viewport={viewport}
          filters={this.state.filters}
          showFilter={this.state.showFilter}
          onFilterCard={this.handleFilterCard}
          onActivateFilters={this.handleActiveFilters}
          onFilterChange={this.handleFilter}
        />
        <View
          style={st.get([
            'Container',
            'CenterColumn',
            {
              // Show the nav bar during loading time and then hide it away
              height:
                viewport !== 'PhoneOnly' && isFetching ? height - 122 : height,
            },
          ])}
        >
          {isFetching && (
            <View style={styles.spinnerContainer}>
              <Spinner large />
              <Text style={st.get(['Body', 'TopGutter'], viewport)}>
                {COPY['loadingMessage']}
              </Text>
            </View>
          )}
          <FlatList
            data={filteredPlans}
            scrollEventThrottle={60}
            // Hacky way to hide the scrollbar RNW does not support
            className="hide-scrollbar"
            onScroll={this.handleScroll}
            extraData={this.state.selectedPlan}
            style={st.get(
              // @BUG: Firefox requires height to be set here
              ['PageMax', 'Margins', styles.listContainer, { height }],
              viewport,
            )}
            ListHeaderComponent={data =>
              !!filteredPlans.length &&
              this.renderHeader({ total, monthlySavings, hasCSR })
            }
            ListEmptyComponent={!loading && this.renderListEmptyMessage}
            ListFooterComponent={this.renderFooter}
            getItemLayout={this.handleItemLayout}
            keyExtractor={this.handleItemKey}
            renderItem={this.renderItem}
            ref={this.handleListRef}
          />
          {viewport === 'TabletLandscapeUp' && this.renderDetailView()}
        </View>
      </React.Fragment>
    );
    return Platform.select({
      web: (
        <ScrollView
          ref={this.handleRef}
          scrollEnabled={this.state.scrollEnabled}
          className="hide-scrollbar"
        >
          {list}
        </ScrollView>
      ),
      default: list,
    });
  };
  handleItemLayout = (data, index) => {
    const ITEM_HEIGHT = 314;
    return { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index };
  };
  // Renders when there are not elements in the list
  renderListEmptyMessage = () => {
    const { viewport } = this.props;
    return (
      <View style={st.get(['BottomGutter', 'ContentMax'])}>
        <Text style={st.get(['H3'], viewport)}>{COPY['emptyTitle']}</Text>
        <Text style={st.get(['Body', 'TopGutter', 'BottomGutter'], viewport)}>
          {COPY['emptySubtitle']}
        </Text>
        <Text
          onPress={this.handleActiveFilters}
          style={st.get(['BodyLink'], viewport)}
        >
          {COPY['resetLink']}
        </Text>
      </View>
    );
  };
  // In wide viewport we render the detail view inside the scroll view
  // so it fits below the nav and filter bar
  // In narrow viewports we render it above everything else.
  renderDetailView = () => (
    <HealthPlanDetailView
      planID={this.state.selectedPlan}
      onMobileBack={this.handleSelect}
      onRef={this.handleOverlayRef}
      push={this.props.push}
    />
  );
  handleItemKey = ({ id }) => id;
  // Bind ref handlers for performance
  handleRef = el => {
    this.scrollContainer = el;
  };
  handleListRef = el => {
    this.flatList = el;
  };
  handleOverlayRef = el => {
    this.overlayScroll = el;
  };
  render() {
    const { viewport, push, size } = this.props;
    const {
      filters,
      showFilter,
      selectedPlan,
      scrollEnabled,
      activeFilters,
    } = this.state;
    return (
      <View style={st.get(['Flex1', 'FullWidth', { overflow: 'hidden' }])}>
        {viewport === 'TabletLandscapeUp' && (
          <View style={styles.figureContainer}>
            <Figure name="giant-topo" />
          </View>
        )}
        <HealthPlans
          filters={filters}
          scroll={scrollEnabled}
          showFilter={showFilter}
          children={this.renderList}
          selectedPlan={selectedPlan}
          activeFilters={activeFilters}
          // handling the initial plan id after the list is done loading
          // feels more graceful
          onCompleted={this.handleInitialPlanDetails}
        />
        {viewport === 'TabletLandscapeUp' && (
          <DetailBottomBar
            size={size}
            viewport={viewport}
            planID={this.state.selectedPlan}
            onSubmit={this.handleCompleted}
            buttonText={COPY['submitButton']}
          />
        )}
        {Platform.OS === 'web' &&
          viewport !== 'TabletLandscapeUp' &&
          this.renderDetailView()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContainer: {
    paddingTop: 48,
    paddingBottom: 48,
    height: '100%',
    width: '100%',
  },
  listFooter: {
    height: 48,
    width: '100%',
  },
  spinnerContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  figureContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default withDimensions(HealthPlanListView);
