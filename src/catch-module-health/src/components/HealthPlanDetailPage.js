import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Linking,
  Platform,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, Spinner, colors, Icon, Button } from '@catch/rio-ui-kit';
import { Currency, Segment } from '@catch/utils';
import HealthMetalFlag from './HealthMetalFlag';
import HealthPlanSection from './HealthPlanSection';

const PREFIX = 'catch.health.HealthPlanDetailPage';
export const COPY = {
  premiumLabel: <FormattedMessage id={`${PREFIX}.premiumLabel`} />,
  planTypeLabel: <FormattedMessage id={`${PREFIX}.planTypeLabel`} />,
  deductibleLabel: <FormattedMessage id={`${PREFIX}.deductibleLabel`} />,
  moopLabel: <FormattedMessage id={`${PREFIX}.moopLabel`} />,
  individualCostLabel: (
    <FormattedMessage id={`${PREFIX}.individualCostLabel`} />
  ),
  familyCostLabel: <FormattedMessage id={`${PREFIX}.familyCostLabel`} />,
  primaryLabel: <FormattedMessage id={`${PREFIX}.primaryLabel`} />,
  specialistLabel: <FormattedMessage id={`${PREFIX}.specialistLabel`} />,
  emergencyLabel: <FormattedMessage id={`${PREFIX}.emergencyLabel`} />,
  drugsLabel: <FormattedMessage id={`${PREFIX}.drugsLabel`} />,
  docLabel: <FormattedMessage id={`${PREFIX}.docLabel`} />,
  prescripLabel: <FormattedMessage id={`${PREFIX}.prescripLabel`} />,
  vdLabel: <FormattedMessage id={`${PREFIX}.vdLabel`} />,
  familyLabel: <FormattedMessage id={`${PREFIX}.familyLabel`} />,
  generalLabel: <FormattedMessage id={`${PREFIX}.generalLabel`} />,
  surgeryLabel: <FormattedMessage id={`${PREFIX}.surgeryLabel`} />,
  labWorkLabel: <FormattedMessage id={`${PREFIX}.labWorkLabel`} />,
  freeCareLabel: <FormattedMessage id={`${PREFIX}.freeCareLabel`} />,
  deductibleCaption: values => (
    <FormattedMessage id={`${PREFIX}.deductibleCaption`} values={values} />
  ),
  afterPrefix: <FormattedMessage id={`${PREFIX}.afterPrefix`} />,
  beforePrefix: <FormattedMessage id={`${PREFIX}.beforePrefix`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
  freeCareOther: values => (
    <FormattedMessage id={`${PREFIX}.freeCareOther`} values={values} />
  ),
  'freeCareOther.link': (
    <FormattedMessage id={`${PREFIX}.freeCareOther.link`} />
  ),
};

const pcUrl = 'https://www.healthcare.gov/coverage/preventive-care-benefits/';

const freeCareItems = Object.keys(COPY)
  .filter(el => /freeCareItems/.test(el))
  .map(el => ({ label: COPY[el], value: 'Free' }));

function renderValue(val) {
  return typeof val === 'number' ? <Currency whole>{val}</Currency> : val;
}

const Container = Animated.createAnimatedComponent(SafeAreaView);

class HealthPlanDetailPage extends React.PureComponent {
  constructor(props) {
    super(props);
    const {
      size: {
        window: { width },
      },
      viewport,
    } = this.props;
    this.state = {
      expandedSection: null,
      pageLeft: new Animated.Value(
        viewport === 'TabletLandscapeUp'
          ? width / 2
          : viewport === 'TabletPortraitUp'
            ? 480
            : width,
      ),
    };
  }
  componentDidMount() {
    if (Platform.OS !== 'web') {
      this.savePlan();
    }
  }
  componentDidUpdate(prevProps) {
    const { planID, savedPlanID } = this.props;
    if (!prevProps.planID && planID) {
      this.handleSlideIn();
    } else if (prevProps.planID && !planID) {
      this.handleSlideOut();
    }
    if (planID && planID !== prevProps.planID) {
      this.savePlan();
    }
  }
  savePlan = () => {
    const { planID } = this.props;
    // Save every time a user browse a new plan
    this.props.onSave();
    Segment.healthPlanViewed(planID);
  };
  handleSlideIn = () => {
    Animated.timing(this.state.pageLeft, {
      toValue: 0,
      duration: 150,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  handleSlideOut = () => {
    const {
      size: {
        window: { width },
      },
      viewport,
    } = this.props;
    Animated.timing(this.state.pageLeft, {
      toValue:
        viewport === 'TabletLandscapeUp'
          ? width / 2
          : viewport === 'TabletPortraitUp'
            ? 480
            : width,
      duration: 150,
      easing: Easing.out(Easing.ease),
    }).start();
  };
  handleSelect = idx => {
    if (this.state.expandedSection === idx) {
      this.setState({
        expandedSection: null,
      });
    } else {
      this.setState({
        expandedSection: idx,
      });
    }
  };
  handleAdjustScroll = idx => {
    const { yearlyMoop, yearlyDeduct } = this.props;
    let topHeight = 700;
    if (Array.isArray(yearlyMoop)) {
      topHeight += 52;
    }
    if (Array.isArray(yearlyDeduct)) {
      topHeight += 52;
    }
    const scrollY = topHeight + idx * 74;
    this.scroller.scrollTo({ y: scrollY, animated: true });
  };
  handleRef = el => {
    this.scroller = el;
    if (Platform.OS === 'web') {
      this.props.onRef(el);
    }
  };
  renderIndividualCost = items => {
    const { viewport } = this.props;
    const item = items.find(
      item =>
        item.familyCost === 'Family Per Person' ||
        item.familyCost === 'Individual',
    );
    return (
      item && (
        <View style={st.get('Row')}>
          <Text style={st.get(['Body', 'RightGutter'], viewport)}>
            {COPY['individualCostLabel']}
          </Text>
          <Text style={st.get(['Body', 'Medium'], viewport)}>
            {renderValue(item.amount)}
          </Text>
        </View>
      )
    );
  };
  renderFamilyCost = items => {
    const { viewport } = this.props;
    const item = items.find(item => item.familyCost === 'Family');
    return (
      item && (
        <View style={st.get('Row')}>
          <Text style={st.get(['Body', 'RightGutter'], viewport)}>
            {COPY['familyCostLabel']}
          </Text>
          <Text style={st.get(['Body', 'Medium'], viewport)}>
            {renderValue(item.amount)}
          </Text>
        </View>
      )
    );
  };
  render() {
    const {
      size,
      planID,
      viewport,
      loading,
      metalLevel,
      planName,
      provider,
      planType,
      onMobileBack,
      monthlySavings,
      monthlyPremium,
      planBrochure,
      yearlyDeduct,
      yearlyMoop,
      primaryCare,
      emergency,
      specialist,
      onSubmit,
      onSave,
      drugs,
      benefits: {
        doctorVisits,
        prescriptions,
        visionAndDental,
        familyPlanning,
        generalServices,
        surgeries,
        labWork,
        freeCare,
      },
    } = this.props;
    const { expandedSection } = this.state;

    function formatCosts(costs) {
      if (Array.isArray(costs)) {
        const number = costs.find(
          cost =>
            cost.familyCost === 'Family Per Person' ||
            cost.familyCost === 'Individual',
        );
        return number ? number.amount : costs[0].amount;
      } else {
        return costs;
      }
    }

    const titles = [
      COPY['deductibleCaption']({
        emphasis: (
          <Text style={st.get(['Body', 'Bold'], viewport)}>
            {COPY['beforePrefix']}
          </Text>
        ),
        // If a user has dependents we don't confuse them with
        // different deductible amounts here
        amount: Array.isArray(yearlyDeduct) ? (
          'your'
        ) : (
          <Currency whole>{formatCosts(yearlyDeduct)}</Currency>
        ),
      }),
      COPY['deductibleCaption']({
        emphasis: (
          <Text style={st.get(['Body', 'Bold'], viewport)}>
            {COPY['afterPrefix']}
          </Text>
        ),
        amount: Array.isArray(yearlyDeduct) ? (
          'your'
        ) : (
          <Currency whole>{formatCosts(yearlyDeduct)}</Currency>
        ),
      }),
    ];

    const {
      window: { width, height },
    } = size;
    return (
      <React.Fragment>
        {!!planID &&
          viewport === 'TabletPortraitUp' && (
            <View
              style={styles.overlay}
              onStartShouldSetResponder={() => true}
              onResponderRelease={() => onMobileBack(null)}
            />
          )}
        <Container
          style={[
            styles.container,
            styles[`container${viewport}`],
            Platform.select({
              web: {
                height,
                width:
                  viewport === 'TabletLandscapeUp'
                    ? width / 2
                    : viewport === 'TabletPortraitUp'
                      ? 480
                      : width,
                transform: [{ translateX: this.state.pageLeft }],
              },
            }),
          ]}
        >
          {Platform.OS === 'web' &&
            viewport === 'PhoneOnly' && (
              <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={() => onMobileBack(null)}
                  style={st.get(['Row', 'CenterColumn'])}
                >
                  <Icon name="left" size={16} fill={colors.flare} />
                  <Text style={st.get(['BodyLink', 'XsLeftGutter'], viewport)}>
                    All plans
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          <ScrollView
            ref={this.handleRef}
            contentContainerStyle={st.get('FullWidth')}
          >
            {loading ? (
              <View style={st.get(['CenterColumn', 'XlTopGutter'])}>
                <Spinner large />
              </View>
            ) : planName ? (
              <React.Fragment>
                <View
                  style={st.get(
                    [
                      'Margins',
                      'FullWidth',
                      styles[`contentContainer${viewport}`],
                    ],
                    viewport,
                  )}
                >
                  <HealthMetalFlag level={metalLevel} viewport={viewport} />
                  <Text
                    style={st.get(
                      ['H3', 'TopGutter', 'SmBottomGutter'],
                      viewport,
                    )}
                  >
                    {provider}
                  </Text>
                  <Text style={st.get(['Body', 'BottomGutter'], viewport)}>
                    {planName}
                  </Text>
                  <View style={[styles.row]}>
                    <Text style={st.get(['H4', 'Regular'], viewport)}>
                      {COPY['premiumLabel']}
                    </Text>
                    <View style={styles.moneyRow}>
                      {monthlySavings > 0 && (
                        <React.Fragment>
                          <View
                            accessibilityLabel="Line through"
                            style={styles.strike}
                          />
                          <Text
                            style={st.get(
                              [
                                'Body',
                                'Bold',
                                styles.premiumColor,
                                'XsBottomGutter',
                              ],
                              viewport,
                            )}
                          >
                            <Currency whole>{monthlyPremium}</Currency>
                          </Text>
                        </React.Fragment>
                      )}
                      <Text
                        style={st.get(
                          ['H3', 'SuccessText', 'SmLeftGutter'],
                          viewport,
                        )}
                      >
                        <Currency whole>
                          {monthlyPremium - monthlySavings < 0
                            ? 0
                            : monthlyPremium - monthlySavings}
                        </Currency>
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.row, styles.thinDivider]}>
                    <Text style={st.get('Body', viewport)}>
                      {COPY['planTypeLabel']}
                    </Text>
                    <Text style={st.get(['Body', 'Medium'], viewport)}>
                      {planType}
                    </Text>
                  </View>
                  {Array.isArray(yearlyDeduct) ? (
                    <View style={st.get(['TopGutter', styles.thinDivider])}>
                      <Text style={st.get('Body', viewport)}>
                        {COPY['deductibleLabel']}
                      </Text>
                      <View style={styles.row}>
                        {this.renderIndividualCost(yearlyDeduct)}
                        {this.renderFamilyCost(yearlyDeduct)}
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.row, styles.thinDivider]}>
                      <Text style={st.get('Body', viewport)}>
                        {COPY['deductibleLabel']}
                      </Text>
                      <Text style={st.get(['Body', 'Medium'], viewport)}>
                        {renderValue(yearlyDeduct)}
                      </Text>
                    </View>
                  )}
                  {Array.isArray(yearlyMoop) ? (
                    <View style={st.get(['TopGutter'])}>
                      <Text style={st.get('Body', viewport)}>
                        {COPY['moopLabel']}
                      </Text>
                      <View style={[styles.row, styles.thickDivider]}>
                        {this.renderIndividualCost(yearlyMoop)}
                        {this.renderFamilyCost(yearlyMoop)}
                      </View>
                    </View>
                  ) : (
                    <View style={[styles.row, styles.thickDivider]}>
                      <Text style={st.get('Body', viewport)}>
                        {COPY['moopLabel']}
                      </Text>
                      <Text style={st.get(['Body', 'Medium'], viewport)}>
                        {renderValue(yearlyMoop)}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.row, styles.thinDivider]}>
                    <Text style={st.get('Body', viewport)}>
                      {COPY['primaryLabel']}
                    </Text>
                    <Text style={st.get(['Body', 'Medium'], viewport)}>
                      {renderValue(primaryCare)}
                    </Text>
                  </View>
                  <View style={[styles.row, styles.thinDivider]}>
                    <Text style={st.get('Body', viewport)}>
                      {COPY['specialistLabel']}
                    </Text>
                    <Text style={st.get(['Body', 'Medium'], viewport)}>
                      {renderValue(specialist)}
                    </Text>
                  </View>
                  <View style={[styles.row, styles.thinDivider]}>
                    <Text style={st.get('Body', viewport)}>
                      {COPY['emergencyLabel']}
                    </Text>
                    <Text style={st.get(['Body', 'Medium'], viewport)}>
                      {renderValue(emergency)}
                    </Text>
                  </View>
                  <View style={[styles.row]}>
                    <Text style={st.get('Body', viewport)}>
                      {COPY['drugsLabel']}
                    </Text>
                    <Text style={st.get(['Body', 'Medium'], viewport)}>
                      {renderValue(drugs)}
                    </Text>
                  </View>
                  <View />
                </View>
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['docLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(0)}
                  onOpen={() => this.handleAdjustScroll(0)}
                  titles={titles}
                  items={doctorVisits}
                  index={0}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['prescripLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(1)}
                  onOpen={() => this.handleAdjustScroll(1)}
                  titles={titles}
                  items={prescriptions}
                  index={1}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['vdLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(2)}
                  onOpen={() => this.handleAdjustScroll(2)}
                  titles={titles}
                  items={visionAndDental}
                  index={2}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['familyLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(3)}
                  onOpen={() => this.handleAdjustScroll(3)}
                  titles={titles}
                  items={familyPlanning}
                  index={3}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['generalLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(4)}
                  onOpen={() => this.handleAdjustScroll(4)}
                  titles={titles}
                  items={generalServices}
                  index={4}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['surgeryLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(5)}
                  onOpen={() => this.handleAdjustScroll(5)}
                  titles={titles}
                  items={surgeries}
                  index={5}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['labWorkLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(6)}
                  onOpen={() => this.handleAdjustScroll(6)}
                  titles={titles}
                  items={labWork}
                  index={6}
                />
                <HealthPlanSection
                  viewport={viewport}
                  label={COPY['freeCareLabel']}
                  activeSection={expandedSection}
                  onSelect={() => this.handleSelect(7)}
                  onOpen={() => this.handleAdjustScroll(7)}
                  items={freeCare}
                  footer={COPY['freeCareOther']({
                    link: (
                      <Text
                        style={st.get(['BodyLink'], viewport)}
                        onPress={Platform.select({
                          default: () => Linking.openURL(pcUrl),
                          web: undefined,
                        })}
                        accessibilityRole={Platform.select({ web: 'link' })}
                        target="_blank"
                        href={pcUrl}
                      >
                        {COPY['freeCareOther.link']}
                      </Text>
                    ),
                  })}
                  index={7}
                />
                <View
                  style={[
                    styles.footerContainer,
                    styles[`footerContainer${viewport}`],
                  ]}
                >
                  <TouchableOpacity
                    href={planBrochure}
                    target="_blank"
                    download={`${planName}.pdf`}
                    accessibilityRole={Platform.select({ web: 'link' })}
                    style={styles.downloadButton}
                  >
                    <Icon
                      name="download"
                      fill={colors.flare}
                      dynamicRules={{ paths: { fill: colors.flare } }}
                      size={15}
                    />
                    <Text
                      style={st.get(['BodyLink', 'XsLeftGutter'], viewport)}
                    >
                      Full plan breakdown
                    </Text>
                  </TouchableOpacity>
                </View>
              </React.Fragment>
            ) : null}
          </ScrollView>
          {viewport !== 'TabletLandscapeUp' && (
            <View style={[styles.bottomBar, styles[`bottomBar${viewport}`]]}>
              <View style={st.get(['FullWidth', 'ButtonMax'])}>
                <Button
                  wide={viewport === 'PhoneOnly'}
                  viewport={viewport}
                  onClick={onSubmit}
                >
                  {COPY['submitButton']}
                </Button>
              </View>
            </View>
          )}
        </Container>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
  },
  containerTabletLandscapeUp: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 0,
      width: -2,
    },
    shadowRadius: 12,
  },
  containerPhoneOnly: {
    left: 0,
    width: '100%',
  },
  contentContainerTabletLandscapeUp: {
    paddingLeft: 40,
    paddingTop: 48,
    paddingBottom: 40,
    paddingRight: 24,
    maxWidth: 480,
  },
  contentContainerTabletPortraitUp: {
    paddingLeft: 32,
    paddingTop: 48,
    paddingBottom: 40,
    paddingRight: 32,
  },
  contentContainerPhoneOnly: {
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: 16,
    paddingTop: 16,
    alignItems: 'center',
  },
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  premiumColor: {
    color: colors['ink+2'],
  },
  strike: {
    position: 'absolute',
    top: 20,
    left: -4,
    transform: [{ rotate: '-20deg' }],
    height: 1,
    width: 44,
    backgroundColor: colors['ink+2'],
  },
  thinDivider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(31, 37, 51, 0.08)',
  },
  thickDivider: {
    borderBottomWidth: 2,
    borderBottomColor: colors['sage+1'],
    paddingBottom: 32,
    marginBottom: 24,
  },
  accordionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 40,
    borderTopWidth: 1,
    borderTopColor: 'rgba(31, 37, 51, 0.08)',
  },
  sectionContainer: {
    overflow: 'hidden',
  },
  sectionContentContainer: {
    paddingLeft: 40,
    paddingBottom: 40,
    maxWidth: 480,
  },
  bottomBar: {
    height: 70,
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: colors['ink+2'],
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 40,
    paddingRight: 24,
    justifyContent: 'flex-end',
  },
  bottomBarPhoneOnly: {
    paddingLeft: 16,
    paddingRight: 16,
    justifyContent: 'center',
  },
  topBar: {
    height: 80,
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerContainer: {
    width: '100%',
    paddingLeft: 40,
    alignItems: 'flex-start',
    paddingBottom: 80,
    paddingTop: 24,
  },
  footerContainerTabletLandscapeUp: {
    paddingBottom: 124,
  },
  downloadButton: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    backgroundColor: '#F5F7FF',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  overlay: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0.6,
    backgroundColor: colors.ink,
    //zIndex: 500,
  },
});

export default HealthPlanDetailPage;
