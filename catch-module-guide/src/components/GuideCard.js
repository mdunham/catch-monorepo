import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { Icon, Button, styles as st, Dot, colors } from '@catch/rio-ui-kit';
import { Currency, Percentage } from '@catch/utils';

import { SetRecommendationImportance as ChangeStatus } from '../containers';
import { ctas, healthCovered } from '../copy';
import GuideFlag from './GuideFlag';
import GuideCardMenu from './GuideCardMenu';
import HealthInfo from './HealthInfo';

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

const LIVE = ['CONTRIBUTING', 'PAUSED'];

const CAN_START = /PLANTYPE_PTO|PLANTYPE_TAX|PLANTYPE_RETIREMENT|PLANTYPE_HEALTH/;

// Conditionally render a margin at the right of the card
function displayMarginRight(index, viewport, horizontal) {
  switch (viewport) {
    // 1 column
    case 'PhoneOnly':
      return horizontal;
    // 2 column
    case 'TabletPortraitUp':
      return (index - 1) % 2 !== 0;
    // 3 column max
    case 'TabletLandscapeUp':
      return (index - 2) % 3 !== 0;
    default:
      return true;
  }
}

function updatesAvailable(updates) {
  return Array.isArray(updates) && updates.length;
}

function accessLabel(planType, index) {
  if (!planType) {
    return 'Benefit card';
  }
  return `${index} Benefit card for ${planType.split('_')[1].toLowerCase()}`;
}

function showHealthData(planType, status, carrier, doctors) {
  return (
    planType === 'PLANTYPE_HEALTH' &&
    status === 'COVERED' &&
    (!!carrier || (doctors && doctors.length))
  );
}

function isWallet(planType, status) {
  return planType === 'PLANTYPE_HEALTH' && status === 'COVERED';
}

const ArrowButton = ({ title, onClick, viewport }) => (
  <TouchableOpacity style={styles.nativeAction} onPress={onClick}>
    <Text style={st.get(['BodyLink', styles.actionText], viewport)}>
      {title}
    </Text>
    <Icon
      name="right"
      fill={colors.flare}
      size={14}
      dynamicRules={{
        paths: {
          fill: colors.flare,
          stroke: colors.flare,
          strokeWidth: 4,
        },
      }}
    />
  </TouchableOpacity>
);

const GuideCard = ({
  id,
  index,
  viewport,
  status,
  planType,
  cardType,
  title,
  description,
  onClick,
  onPlanDetails,
  onPlanStart,
  secondary,
  contribution,
  needBasedImportance,
  comingSoon,
  horizontal,
  balance,
  updates,
  onUpdates,
  disabled,
  carrier,
  doctors,
}) => (
  <View
    accessibilityLabel={accessLabel(planType, index)}
    style={st.get([
      'Paper',
      'LgBottomGutter',
      displayMarginRight(index, viewport, horizontal) && 'LgRightGutter',
      styles.cardContainer,
      !horizontal && styles[`cardContainer${viewport}`],
      secondary && styles[`secondaryCard${viewport}`],
    ])}
  >
    <View style={styles.contentContainer}>
      <View
        style={st.get([
          'Flex1',
          'BottomGutter',
          styles.content,
          updatesAvailable(updates) && styles.contentBottomSpace,
        ])}
      >
        <View style={st.get(['LgBottomGutter', styles.topActions])}>
          {!LIVE.includes(status) &&
            cardType !== 'plan' && (
              <ChangeStatus id={id}>
                {({ setImportance }) => (
                  <GuideCardMenu
                    onChange={setImportance}
                    disabled={disabled}
                    onStart={() => onPlanStart(pathMap[planType])}
                    planName={title}
                    planType={planType}
                    status={status}
                    needBasedImportance={needBasedImportance}
                    style={styles.cardMenuContainer}
                    comingSoon={comingSoon}
                    viewport={viewport}
                    id={id}
                  />
                )}
              </ChangeStatus>
            )}
          <GuideFlag type={status} original={needBasedImportance} />
        </View>
        {!secondary ? (
          <Icon
            size={40}
            name={iconMap[planType] || 'plan-placeholder'}
            viewport={viewport}
          />
        ) : (
          <View />
        )}
        <Text style={st.get(['H3S', 'TopGutter'], viewport)}>{title}</Text>
        {LIVE.includes(status) ? (
          <React.Fragment>
            <View style={st.get(['Bilateral', 'TopGutter', 'SmBottomGutter'])}>
              <Text style={st.get('Body', viewport)}>Contribution</Text>
              <Text style={st.get(['Body', 'Bold'], viewport)}>
                <Percentage whole>{contribution}</Percentage>
              </Text>
            </View>
            <View
              style={st.get([
                'Bilateral',
                viewport === 'PhoneOnly' ? 'LgBottomGutter' : 'SmBottomGutter',
              ])}
            >
              <Text style={st.get('Body', viewport)}>Balance</Text>
              <Text style={st.get(['Body', 'Bold'], viewport)}>
                <Currency>{balance}</Currency>
              </Text>
            </View>
          </React.Fragment>
        ) : (
          !(secondary && viewport === 'PhoneOnly') &&
          (showHealthData(planType, status, carrier, doctors) ? (
            <HealthInfo
              viewport={viewport}
              carrier={carrier}
              doctors={doctors}
            />
          ) : (
            <Text style={st.get('Body', viewport)}>
              {isWallet(planType, status)
                ? healthCovered.description
                : description}
            </Text>
          ))
        )}
      </View>

      {!updatesAvailable(updates) && (
        <View
          style={[
            styles.bottomActions,
            viewport !== 'PhoneOnly' &&
              LIVE.includes(status) &&
              styles.bottomSpace,
          ]}
        >
          {LIVE.includes(status) ||
          showHealthData(planType, status, carrier) ? (
            viewport === 'PhoneOnly' ? (
              <ArrowButton
                title={
                  showHealthData(planType, status, carrier)
                    ? ctas.walletDetails
                    : ctas.details
                }
                onClick={() => onPlanDetails(pathMap[planType])}
                viewport={viewport}
              />
            ) : (
              <Text
                accessibilityLabel="Press to view your plan details"
                onPress={() => onPlanDetails(pathMap[planType])}
                style={st.get('BodyLink', viewport)}
              >
                {showHealthData(planType, status, carrier)
                  ? ctas.walletDetails
                  : ctas.details}
              </Text>
            )
          ) : secondary ? (
            viewport === 'PhoneOnly' ? (
              <ArrowButton
                title={ctas.learn}
                onClick={onClick}
                viewport={viewport}
              />
            ) : (
              <Text
                accessibilityLabel="Press to learn more"
                onPress={onClick}
                style={st.get(['BodyLink'], viewport)}
              >
                {ctas.learn}
              </Text>
            )
          ) : cardType === 'plan' && !disabled ? (
            viewport === 'PhoneOnly' ? (
              <ArrowButton
                title={ctas.default}
                onClick={() => onPlanStart(pathMap[planType])}
                viewport={viewport}
              />
            ) : (
              <Button
                onClick={() => onPlanStart(pathMap[planType])}
                type="tertiary"
                viewport={viewport}
              >
                {ctas.default}
              </Button>
            )
          ) : viewport === 'PhoneOnly' ? (
            <ArrowButton
              title={
                isWallet(planType, status)
                  ? ctas.healthWallet
                  : CAN_START.test(planType)
                    ? ctas.default
                    : ctas.learn
              }
              onClick={onClick}
              viewport={viewport}
            />
          ) : (
            <Button onClick={onClick} type="tertiary" viewport={viewport}>
              {isWallet(planType, status)
                ? ctas.healthWallet
                : CAN_START.test(planType)
                  ? ctas.default
                  : ctas.learn}
            </Button>
          )}
        </View>
      )}
    </View>
    {!!updatesAvailable(updates) && (
      <View style={styles.updateActions}>
        <Text style={st.get(['Body', 'Warning', 'SmBottomGutter'], viewport)}>
          You’ve got a new plan suggestion based on your updated information.
        </Text>
        <Text
          accessibilityLabel="Updates available"
          onPress={() => onUpdates(updates)}
          style={st.get(['BodyLink', 'Warning'], viewport)}
        >
          View now
        </Text>
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    maxWidth: 326,
    width: '100%',
    backgroundColor: '#fff',
  },
  cardContainerPhoneOnly: {
    // Override the maxWidth
    maxWidth: '100%',
  },
  secondaryCardPhoneOnly: {
    maxWidth: 230,
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'space-between',
    padding: 24,
    flex: 1,
    overflow: 'hidden',
    borderRadius: 6,
  },
  cardMenuContainer: {
    zIndex: 100,
  },
  bottomActions: {
    alignSelf: 'flex-start',
    width: '100%',
    alignItems: 'flex-start',
  },
  content: {
    zIndex: 100,
  },
  bottomSpace: {
    marginTop: 66,
  },
  topActions: {
    zIndex: 100,
  },
  updateActions: {
    backgroundColor: 'rgba(254, 238, 237, 0.3)',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    padding: 24,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  contentBottomSpace: {
    paddingBottom: 100,
  },
  nativeAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors['ink+3'],
    width: '100%',
    paddingTop: 20,
  },
});

export default GuideCard;
