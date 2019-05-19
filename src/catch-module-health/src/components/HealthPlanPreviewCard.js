import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { styles as st, colors, Hoverable } from '@catch/rio-ui-kit';
import { Currency } from '@catch/utils';
import { formatDependents } from '../utils';

import HealthMetalFlag from './HealthMetalFlag';

const PREFIX = 'catch.health.HealthPlanPreviewCard';
export const COPY = {
  deductibleLabel: <FormattedMessage id={`${PREFIX}.deductibleLabel`} />,
  pocketLabel: <FormattedMessage id={`${PREFIX}.pocketLabel`} />,
  premiumLabel: <FormattedMessage id={`${PREFIX}.premiumLabel`} />,
};

class HealthPlanPreviewCard extends React.PureComponent {
  render() {
    const {
      id,
      standalone,
      selectedPlan,
      onSelect,
      viewport,
      provider,
      planName,
      type,
      outOfPocket,
      deductible,
      premium,
      metalLevel,
      dependents,
    } = this.props;
    return (
      <Hoverable>
        {isHovered => (
          <View
            accessible={true}
            accessibilityRole={Platform.select({
              web: 'button',
            })}
            accessibilityStates={standalone ? ['disabled'] : undefined}
            onStartShouldSetResponder={() => true}
            onResponderRelease={standalone ? undefined : () => onSelect(id)}
            style={st.get([
              'Paper',
              'LgBottomGutter',
              styles.container,
              styles[`container${viewport}`],
              standalone && styles.standaloneContainer,
              isHovered && !standalone && styles.containerHovered,
            ])}
          >
            <View
              style={[
                styles.innerContainer,
                id === selectedPlan && !standalone && styles.containerSelected,
              ]}
            >
              <View style={styles.body}>
                <View style={st.get(['Bilateral', 'BottomGutter'])}>
                  <HealthMetalFlag level={metalLevel} viewport={viewport} />
                  <Text style={st.get(['H6', 'Bold'], viewport)}>{type}</Text>
                </View>
                <Text style={st.get(['H4', 'XsBottomGutter'], viewport)}>
                  {provider}
                </Text>
                <Text style={st.get(['FinePrint', 'SubtleText'], viewport)}>
                  {planName}
                </Text>
                {standalone ? (
                  <Text style={st.get(['FinePrint', 'SmTopGutter'], viewport)}>
                    {formatDependents(dependents)}
                  </Text>
                ) : (
                  <React.Fragment>
                    <View
                      style={st.get(['Bilateral', 'TopGutter', 'BottomGutter'])}
                    >
                      <Text style={st.get('FinePrint', viewport)}>
                        {COPY['deductibleLabel']}
                      </Text>
                      <Text style={st.get(['FinePrint', 'Medium'], viewport)}>
                        <Currency whole>{deductible}</Currency>
                      </Text>
                    </View>
                    <View style={st.get(['Bilateral'])}>
                      <Text style={st.get('FinePrint', viewport)}>
                        {COPY['pocketLabel']}
                      </Text>
                      <Text style={st.get(['FinePrint', 'Medium'], viewport)}>
                        <Currency whole>{outOfPocket}</Currency>
                      </Text>
                    </View>
                  </React.Fragment>
                )}
              </View>
            </View>
            <View
              style={st.get([
                styles.footer,
                id === selectedPlan && !standalone && styles.footerSelected,
                'Bilateral',
              ])}
            >
              <Text style={st.get('Body', viewport)}>
                {COPY['premiumLabel']}
              </Text>
              <Text style={st.get(['Body', 'Bold'], viewport)}>
                <Currency whole>{premium}</Currency>
              </Text>
            </View>
          </View>
        )}
      </Hoverable>
    );
  }
}

const transitionAnimation = {
  transitionDuration: '100ms',
  transitionProperty: 'all',
  transitionTimingFunction: 'cubic-bezier(.02, .01, .47, 1)',
};

const styles = StyleSheet.create({
  container: {
    width: 327,
    // overflow: 'hidden',
    ...Platform.select({
      web: transitionAnimation,
      default: {},
    }),
    paddingBottom: 54,
    backgroundColor: '#fff',
    height: 290,
  },
  standaloneContainer: {
    height: 'auto',
  },
  containerHovered: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {
      height: 3,
      width: 3,
    },
    shadowRadius: 9,
    transform: [{ scale: 1.06 }],
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 3,
    borderColor: 'transparent',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  containerSelected: {
    borderWidth: 3,
    borderColor: '#A9C0C4',
  },
  containerPhoneOnly: {
    width: '100%',
  },
  body: {
    padding: 16,
    width: '100%',
  },
  footer: {
    padding: 16,
    width: '100%',
    backgroundColor: colors['sage+2'],
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    borderLeftWidth: 3,
    borderLeftColor: colors['sage+2'],
    borderBottomWidth: 3,
    borderBottomColor: colors['sage+2'],
    borderRightWidth: 3,
    borderRightColor: colors['sage+2'],
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  footerSelected: {
    borderBottomColor: '#A9C0C4',
    borderRightColor: '#A9C0C4',
    borderLeftColor: '#A9C0C4',
  },
});

export default HealthPlanPreviewCard;
