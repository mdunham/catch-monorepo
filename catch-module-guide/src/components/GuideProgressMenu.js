import React from 'react';
import {
  Text,
  View,
  Animated,
  StyleSheet,
  Easing,
  Platform,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Icon, styles as st, withHover, colors } from '@catch/rio-ui-kit';

const iconMap = {
  PLANTYPE_TAX: {
    VITAL: 'tax-default',
    IMPORTANT: 'tax-default',
    CONTRIBUTING: 'tax-covered',
    COVERED: 'tax-covered',
    UPDATES: 'tax-updates',
    PAUSED: 'tax-paused',
  },
  PLANTYPE_PTO: {
    VITAL: 'timeoff-default',
    IMPORTANT: 'timeoff-default',
    CONTRIBUTING: 'timeoff-covered',
    COVERED: 'timeoff-covered',
    UPDATES: 'timeoff-updates',
    PAUSED: 'timeoff-paused',
  },
  PLANTYPE_RETIREMENT: {
    VITAL: 'retirement-default',
    IMPORTANT: 'retirement-default',
    CONTRIBUTING: 'retirement-covered',
    COVERED: 'retirement-covered',
    UPDATES: 'retirement-updates',
    PAUSED: 'retirement-paused',
  },
  PLANTYPE_HEALTH: {
    VITAL: 'health-default',
    IMPORTANT: 'health-default',
    CONTRIBUTING: 'health-covered',
    COVERED: 'health-covered',
    UPDATES: 'health-updates',
    PAUSED: 'health-paused',
  },
  PLACEHOLDER: {
    VITAL: 'plan-placeholder-default',
    IMPORTANT: 'plan-placeholder-default',
    COVERED: 'plan-placeholder-covered',
  },
};

const pathMap = {
  PLANTYPE_PTO: 'timeoff',
  PLANTYPE_TAX: 'taxes',
  PLANTYPE_RETIREMENT: 'retirement',
};

const PREFIX = 'catch.guide.shield';
export const COPY = {
  NO_COVERAGE: <FormattedMessage id={`${PREFIX}.NO_COVERAGE`} />,
  SOME_COVERAGE: <FormattedMessage id={`${PREFIX}.SOME_COVERAGE`} />,
  FULL_COVERAGE: <FormattedMessage id={`${PREFIX}.FULL_COVERAGE`} />,
  UPDATES: <FormattedMessage id={`${PREFIX}.UPDATES`} />,
};

const showInfo = ['VITAL', 'IMPORTANT', 'COVERED'];

function updatesAvailable(updates) {
  return Array.isArray(updates) && updates.length;
}

/**
 * ===================== GuideProgress ===============================
 * The GuideShield is a cross platform progress tracker on a user's
 * recommended verticals.
 * =================================================================
 * The card renders a list of verticals mapped as icons from the current
 * recommendations section. Each icon may be in 4 different states:
 * - Defaults or no state: the vertical is in the section but hasn't been started.
 * Pressing the icon may navigate to either the info modal if are not offering the vertical yet
 * or the plan start page.
 * - Covered: user is either covered externally or via Catch and plan is live
 * Pressing the icon may navigate to either the info modal if we are not offering the vertical yet
 * or the plan overview page.
 * - Paused: user is covered via Catch and the vertical is paused
 * Pressing the icon navigates to the overview page of the respective vertical
 * - Updates: The Catch vertical is live but there are some updates available based
 * on new survey recommendations.
 * Pressing the icon will navigate to an action screen to update the plan in native or open it
 * in a modal in web
 */

const GuideProgressMenu = ({
  coveredCount,
  recCount,
  shieldState,
  items,
  onInfo,
  onUpdates,
  onPlanDetails,
  viewport,
}) => (
  <React.Fragment>
    <Text style={st.get(['H6', 'BottomGutter'], viewport)}>
      {coveredCount} OF {recCount} COVERED
    </Text>
    <Text style={st.get('H3S', viewport)}>{COPY[shieldState]}</Text>
    <View style={st.get(['FullWidth', 'Row', 'XlTopGutter', 'Wrap'])}>
      {items.map(plan => {
        const status = updatesAvailable(plan.updates)
          ? 'UPDATES'
          : plan.importance;
        const name = iconMap[plan.type]
          ? iconMap[plan.type][status]
          : iconMap.PLACEHOLDER[status];
        return (
          <View key={plan.id} style={styles.icon}>
            <Icon
              name={name}
              fill="none"
              onClick={
                showInfo.includes(plan.importance)
                  ? () => onInfo(plan)
                  : updatesAvailable(plan.updates)
                    ? () => onUpdates(plan.updates)
                    : () => onPlanDetails(pathMap[plan.type])
              }
              size={60}
            />
          </View>
        );
      })}
    </View>
  </React.Fragment>
);

const styles = StyleSheet.create({
  icon: {
    width: '25%',
    marginBottom: 24,
  },
});

export default GuideProgressMenu;
