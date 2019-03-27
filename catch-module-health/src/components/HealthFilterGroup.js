import React from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';

import { styles as st, Icon, Button, colors, Modal } from '@catch/rio-ui-kit';

import NetworkFilterCard from './NetworkFilterCard';
import TiersFilterCard from './TiersFilterCard';
import PremiumFilterCard from './PremiumFilterCard';

class HealthFilterGroup extends React.PureComponent {
  render() {
    const {
      viewport,
      onFilterChange,
      onClose,
      filters,
      maxPremium,
      minPremium,
      resultNum,
      onActivate,
      onReset,
    } = this.props;
    return (
      <Modal viewport={viewport} onRequestClose={onClose}>
        <SafeAreaView style={st.get(['Flex1', 'White'])}>
          <View
            style={[
              styles.topBar,
              Platform.OS !== 'web' && styles.topBarNative,
            ]}
          >
            <Icon
              name="close"
              fill={colors.ink}
              dynamicRules={{ paths: { fill: colors.ink } }}
              onClick={onClose}
              size={30}
            />
            <Text
              style={st.get(['Body', 'Medium'], viewport)}
              onPress={onReset}
            >
              Reset
            </Text>
          </View>
          <ScrollView>
            <NetworkFilterCard
              viewport={viewport}
              onFilterChange={onFilterChange}
              filters={filters}
            />
            <TiersFilterCard
              viewport={viewport}
              onFilterChange={onFilterChange}
              filters={filters}
            />
            <PremiumFilterCard
              viewport={viewport}
              onFilterChange={onFilterChange}
              maxPremium={maxPremium}
              minPremium={minPremium}
              filters={filters}
            />
          </ScrollView>
          <View style={styles.bottomBar}>
            <View style={st.get(['FullWidth', 'ButtonMax'])}>
              <Button onClick={onActivate}>View {resultNum} plan</Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  bottomBar: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {
      height: 0,
      width: -2,
    },
    shadowRadius: 6,
    borderTopColor: colors['ink+3'],
    borderTopWidth: 1,
  },
  topBar: {
    width: '100%',
    height: 58,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 24,
    bottom: 0,
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors['ink+3'],
  },
  topBarNative: {
    paddingLeft: 16,
    paddingRight: 16,
  },
});

export default HealthFilterGroup;
