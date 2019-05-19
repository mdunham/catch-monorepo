import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Currency } from '@catch/utils';
import {
  colors,
  borderRadius,
  shadow,
  elementColors,
  Box,
  Flag,
  Button,
  Hoverable,
  withHover,
  Icon,
  Text as Label,
  styles as st,
} from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.plan.GoalCardActive';
export const COPY = {
  draftCaption: values => (
    <FormattedMessage id={`${PREFIX}.draftCaption`} values={values} />
  ),
};

const styles = StyleSheet.create({
  cardContainer: {
    justifyContent: 'space-between',
    maxWidth: 322,
    maxHeight: 258,
    width: '100%',
    minWidth: 255,
  },
  cardContainerPhoneOnly: {
    maxWidth: '100%',
  },
  flagContainer: {
    height: 32,
    alignSelf: 'baseline',
    marginBottom: 16,
  },
});

function displayMarginRight(index, viewport, horizontal) {
  switch (viewport) {
    // 1 column
    case 'PhoneOnly':
      return horizontal;
    // 2 column
    case 'TabletLandscapeUp':
    case 'TabletPortraitUp':
      return (index - 1) % 2 !== 0;
    default:
      return true;
  }
}

const PlanCard = ({
  title,
  index,
  percent,
  status,
  onClick,
  action,
  raise,
  isHovered,
  icon,
  balance,
  isInsurance,
  isProcessing,
  viewport,
  ...other
}) => (
  <TouchableOpacity
    onPress={onClick}
    style={st.get(
      [
        'Card',
        'LgBottomGutter',
        displayMarginRight(index, viewport, false) && 'LgRightGutter',
        styles.cardContainer,
        styles[`cardContainer${viewport}`],
      ],
      viewport,
    )}
  >
    <View style={styles.flagContainer}>
      {/* TODO: handle all goal status states */
      status === 'PAUSED' &&
        !isProcessing && (
          <Flag type="paused" mb={1}>
            {status}
          </Flag>
        )}
      {isProcessing &&
        (status === 'ACTIVE' || status === 'PAUSED') && (
          <Flag type="inactive" mb={1}>
            PROCESSING
          </Flag>
        )}
    </View>
    <Icon name={icon} size={40} />
    <Text style={st.get(['H3S', 'LgTopGutter', 'LgBottomGutter'], viewport)}>
      {title}
    </Text>
    <View style={st.get(['Row', 'FullWidth', 'CenterColumn'])}>
      <View style={st.get(['Flex1', 'DividerRight', 'LgRightGutter'])}>
        <Label size={11} space={0.5} weight="medium" mb={1}>
          TOTAL SAVED
        </Label>
        <Text
          style={st.get(
            ['Body', 'Bold', balance ? 'SuccessText' : 'SubtleText'],
            viewport,
          )}
        >
          {status === 'DRAFT' ? (
            COPY['draftCaption']({ percent })
          ) : isInsurance ? (
            status
          ) : (
            <Currency>{balance}</Currency>
          )}
        </Text>
      </View>
      <View style={st.get('Flex1')}>
        <Label size={11} space={0.5} weight="medium" mb={1}>
          CONTRIBUTING
        </Label>
        <Text style={st.get(['Body', 'Bold'], viewport)}>{percent}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

PlanCard.propTypes = {
  /** The content to be rendered */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  percent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.node,
  ]),
  onClick: PropTypes.func.isRequired,
  action: PropTypes.string,
  raised: PropTypes.bool,
  isHovered: PropTypes.bool,
  icon: PropTypes.string.isRequired,
  isProcessing: PropTypes.bool,
};

PlanCard.defaultProps = {
  isProcessing: false,
};

export default PlanCard;
