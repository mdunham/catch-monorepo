import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

import {
  Button,
  styles as st,
  Figure,
  Icon,
  Modal,
  colors,
  withDimensions,
} from '@catch/rio-ui-kit';
import { goBack, Segment, goTo } from '@catch/utils';
import { HealthCta } from '@catch/common';

import { SetInterest } from '../containers';
import { ctas, healthCovered } from '../copy';
import { GuideFlag } from '../components';

const iconMap = {
  PLANTYPE_PTO: 'timeoff',
  PLANTYPE_TAX: 'tax',
  PLANTYPE_RETIREMENT: 'retirement',
  PLANTYPE_HEALTH: 'health',
};

const pathMap = {
  PLANTYPE_PTO: 'timeoff',
  PLANTYPE_TAX: 'taxes',
  PLANTYPE_RETIREMENT: 'retirement',
  PLANTYPE_HEALTH: 'health',
};

const textMap = {
  PLANTYPE_PTO: ctas.default,
  PLANTYPE_TAX: ctas.default,
  PLANTYPE_RETIREMENT: ctas.default,
  PLANTYPE_HEALTH: ctas.healthExplorer,
};

const Container = Platform.select({
  web: Modal,
  default: View,
});

const live = [
  'PLANTYPE_PTO',
  'PLANTYPE_TAX',
  'PLANTYPE_RETIREMENT',
  'PLANTYPE_HEALTH',
];
const rec = ['VITAL', 'IMPORTANT', 'CONSIDER'];
const notRec = ['NONE'];

export function showReason(needBasedImportance, importance, reason) {
  if (!reason) {
    return false;
  }
  if (importance === 'COVERED') {
    return false;
  }
  return rec.concat(notRec).includes(needBasedImportance);
}

export class GuideInfoView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goBack = goBack.bind(this);
    this.goTo = goTo.bind(this);
    this.state = {
      isInterested: this.props.isInterested,
    };
  }
  handleInterest = cb => {
    const { type, id } = this.props;
    return () => {
      cb({
        variables: {
          input: {
            recommendationID: id,
            isInterested: true,
          },
        },
      });
      Segment.interestExpressed(type);
      // Unfortunately a bit hacky but we can't get direct
      // updates from the cache when the props are loaded from
      // navigation in native
      this.setState({
        isInterested: true,
      });
    };
  };
  handlePlanStart = plan => {
    if (Platform.OS === 'web') {
      this.props.onStart(plan);
    } else {
      this.goTo(`/plan/${plan}/intro`, {}, 'RESET');
    }
    const { onDismiss } = this.props;
    if (onDismiss) {
      onDismiss();
    }
  };
  render() {
    const {
      id,
      type,
      title,
      importance,
      needBasedImportance,
      p1,
      p2,
      caption,
      reason,
      onStart,
      onDismiss,
      disabled,
      onInterest,
      viewport,
      secondary,
      breakpoints,
    } = this.props;
    const { isInterested } = this.state;

    // Allow wallet access if health importance is marked as covered
    const isWallet = type === 'PLANTYPE_HEALTH' && importance === 'COVERED';

    return (
      <SetInterest id={id}>
        {({ setInterest }) => (
          <Container
            style={Platform.select({
              default: st.get('Flex1'),
              web: undefined,
            })}
            viewport={viewport}
            onRequestClose={onDismiss}
          >
            <View
              style={st.get(
                [
                  styles.modalContainer,
                  styles[`modalContainer${viewport}`],
                  'BottomSpace',
                ],
                viewport,
              )}
            >
              <View style={styles.topRightContainer}>
                <Figure name="topo-top-right" />
              </View>
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  style={styles.topRightControl}
                  onPress={onDismiss}
                >
                  <Icon name="close" size={22} fill="ink" />
                </TouchableOpacity>
              )}
              <ScrollView
                contentContainerStyle={st.get(
                  [
                    'Margins',
                    'TopSpace',
                    styles[`${viewport}Margins`],
                    styles.scrollContainer,
                  ],
                  viewport,
                )}
              >
                {Platform.OS !== 'web' && (
                  <TouchableOpacity
                    style={styles.topLeftControl}
                    onPress={() => this.goBack()}
                  >
                    <Icon
                      name="left"
                      size={18.67}
                      dynamicRules={{ paths: { fill: colors.ink } }}
                    />
                  </TouchableOpacity>
                )}
                <GuideFlag type={importance} original={needBasedImportance} />
                <Text
                  style={st.get(
                    ['H2S', 'XlBottomGutter', 'LgTopGutter'],
                    viewport,
                  )}
                >
                  {title}
                </Text>
                <View style={styles.rule} />
                {showReason(needBasedImportance, importance, reason) && (
                  <React.Fragment>
                    <Text
                      style={st.get(['FinePrint', 'LgTopGutter'], viewport)}
                    >
                      {rec.includes(needBasedImportance)
                        ? 'Recommended because you'
                        : 'Not recommended because you'}
                    </Text>
                    <Text style={st.get(['FinePrint', 'Bold'], viewport)}>
                      {reason}
                    </Text>
                  </React.Fragment>
                )}
                <Text
                  style={st.get(
                    ['Body', 'BottomGutter', 'LgTopGutter'],
                    viewport,
                  )}
                >
                  {p1}
                </Text>
                <Text style={st.get(['Body', 'BottomGutter'], viewport)}>
                  {p2}
                </Text>
                {isWallet && (
                  <HealthCta
                    viewport={viewport}
                    onPress={Platform.select({
                      web: () => onStart('health'),
                      default: () => this.handlePlanStart('health'),
                    })}
                  />
                )}
              </ScrollView>
              <View
                style={st.get(
                  [
                    'BottomBar',
                    'Margins',
                    styles[`${viewport}Margins`],
                    styles.bottomBar,
                  ],
                  viewport,
                )}
              >
                <View
                  style={st.get(['ContainerRow', 'Bilateral', 'CenterRow'])}
                >
                  {viewport !== 'PhoneOnly' && (
                    <View style={st.get('CenterLeftRow')}>
                      {!secondary && (
                        <View style={st.get('LgRightGutter')}>
                          <Icon
                            size={36}
                            name={iconMap[type] || 'plan-placeholder'}
                          />
                        </View>
                      )}
                      <View>
                        <Text style={st.get(['Body', 'Medium'], viewport)}>
                          {title}
                        </Text>
                        <Text style={st.get('FinePrint', viewport)}>
                          {isWallet ? healthCovered.caption : caption}
                        </Text>
                      </View>
                    </View>
                  )}
                  {live.includes(type) ? (
                    !disabled && (
                      <Button
                        viewport={viewport}
                        wide={viewport === 'PhoneOnly'}
                        onClick={() =>
                          this.handlePlanStart(
                            isWallet ? 'health/wallet' : pathMap[type],
                          )
                        }
                      >
                        {isWallet ? ctas.healthWallet : textMap[type]}
                      </Button>
                    )
                  ) : isInterested ? (
                    <Text
                      accessibilityLabel="interestSaved"
                      style={st.get(
                        [
                          'Body',
                          'Success',
                          'Medium',
                          breakpoints.select({
                            PhoneOnly: 'CenterText',
                            'TabletLandscapeUp|TabletPortraitUp': 'RightText',
                          }),
                          'ButtonMax',
                          'FullWidth',
                        ],
                        viewport,
                      )}
                    >
                      We'll keep you in the loop with Catch {title} updates
                    </Text>
                  ) : (
                    breakpoints.select({
                      PhoneOnly: (
                        <Button
                          type="outline"
                          wide
                          onClick={this.handleInterest(setInterest)}
                        >
                          {ctas.interest}
                        </Button>
                      ),
                      'TabletLandscapeUp|TabletPortraitUp': (
                        <Text
                          accessibilityLabel="interestLink"
                          onPress={this.handleInterest(setInterest)}
                          style={st.get('BodyLink', viewport)}
                        >
                          {ctas.interest}
                        </Text>
                      ),
                    })
                  )}
                </View>
              </View>
            </View>
          </Container>
        )}
      </SetInterest>
    );
  }
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    maxWidth: 600,
    maxHeight: 600,
  },
  modalContainerPhoneOnly: {
    maxHeight: '100%',
  },
  topRightContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  topRightControl: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 24,
    paddingRight: 24,
    zIndex: 1200,
  },
  topLeftControl: {
    paddingRight: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  scrollContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 80,
    alignItems: 'flex-start',
  },
  bottomBar: {
    borderTopWidth: 1,
    borderTopColor: colors['sage+1'],
    height: 80,
  },
  rule: {
    height: 2,
    width: 64,
    backgroundColor: colors['sage+1'],
  },
  TabletLandscapeUpMargins: {
    paddingHorizontal: 40,
  },
  TabletPortraitUpMargins: {
    paddingHorizontal: 40,
  },
});

const Component = withDimensions(GuideInfoView);

Component.displayName = 'GuideInfoView';

export default Component;
