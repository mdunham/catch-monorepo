import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { Icon, styles as st } from '@catch/rio-ui-kit';

const iconMap = {
  PLANTYPE_PTO: 'timeoff',
  PLANTYPE_TAX: 'tax',
  PLANTYPE_RETIREMENT: 'retirement',
  PLANTYPE_LINEUP: 'chronometer',
};

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

function accessLabel(planType, index) {
  if (!planType) {
    return 'Additional plan card';
  }
  return `Additional plan card for ${planType.split('_')[1].toLowerCase()}`;
}

const AdditionalPlanCard = ({ onClick, title, index, planType, viewport }) => (
  <View
    accessiblityLabel={accessLabel(planType)}
    style={st.get([
      'Card',
      displayMarginRight(index, viewport, false) && 'LgRightGutter',
      'LgBottomGutter',
      styles.cardContainer,
      styles[`cardContainer${viewport}`],
    ])}
  >
    <Icon
      size={40}
      name={iconMap[planType] || 'plan-placeholder'}
      viewport={viewport}
    />
    <Text style={st.get(['H4S', 'BottomGutter', 'LgTopGutter'], viewport)}>
      {title}
    </Text>
    <Text style={st.get('BodyLink', viewport)} onPress={onClick}>
      {planType === 'PLANTYPE_LINEUP' ? 'Check out the lineup' : 'Get started'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'space-between',
    maxWidth: 326,
    width: '100%',
  },
  cardContainerPhoneOnly: {
    maxWidth: '100%',
  },
});

export default AdditionalPlanCard;
