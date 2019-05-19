import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

import {
  Divider,
  Icon,
  Box,
  H1,
  Spinner,
  Text,
  FeatureTooltip,
  animations,
  borderRadius,
  colors,
  shadow,
  space,
} from '@catch/rio-ui-kit';
import { formatCurrency, Percentage, Env } from '@catch/utils';

const styles = StyleSheet.create({
  base: {
    borderColor: colors['ink+3'],
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: borderRadius.large,
    backgroundColor: colors.white,
    ...shadow.card,
    ...animations.fadeInNext,
  },
  header: {
    backgroundColor: colors['sage+1'],
    borderTopLeftRadius: borderRadius.large,
    borderTopRightRadius: borderRadius.large,
  },
  stepperLeft: {
    paddingRight: space[3],
    paddingTop: space[2],
  },
  stepperRight: {
    paddingLeft: space[3],
    paddingTop: space[2],
  },
  disabled: {
    opacity: 0.3,
  },
});

class ResultCard extends PureComponent {
  static propTypes = {
    // Can handle a FormattedMessage or string if needed.
    percent: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    percentLegend: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    description: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    headerText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    infoText: PropTypes.string,
    infoComponent: PropTypes.object,
    isLoading: PropTypes.bool,
  };
  static defaultProps = {
    input: {
      onChange: () => {},
      value: 0,
    },
    isLoading: false,
  };
  render() {
    const {
      percent,
      percentLegend,
      description,
      headerText,
      infoText,
      infoComponent,
      isEditing,
      input: { onChange, value },
      adjustmentError,
      baseStyleOverride,
      isLoading,
    } = this.props;

    return (
      <Box style={[styles.base, baseStyleOverride]} justify="center">
        {isLoading ? (
          <Box p={4} align="center">
            <Spinner large />
          </Box>
        ) : (
          <React.Fragment>
            {!!headerText &&
              isEditing && (
                <Box p={1} style={styles.header}>
                  <Text
                    center
                    size="small"
                    weight="medium"
                    textCase="uppercase"
                  >
                    {headerText}
                  </Text>
                </Box>
              )}
            <Box pb={2} pt={isEditing ? 4 : 50} px={3}>
              {isEditing ? (
                <Box row align="flex-start" justify="center">
                  <View
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={() =>
                      percent <= 0.01 ? {} : onChange(value - 0.01)
                    }
                    accessible={true}
                    style={styles.stepperLeft}
                  >
                    <Icon name="minus" size={31} />
                  </View>
                  <Box pb={2} align="center" style={{ height: 95 }}>
                    <H1
                      qaName="paycheckPercentage"
                      color="ink"
                      center
                      size={48}
                    >
                      <Percentage whole>{percent}</Percentage>
                    </H1>
                    <Text center weight="medium">
                      {percentLegend}
                    </Text>
                    <Text center size="small" color="error" my={1}>
                      {adjustmentError}
                    </Text>
                  </Box>
                  <View
                    onStartShouldSetResponder={() => true}
                    onResponderGrant={() =>
                      adjustmentError || percent < 0.01
                        ? {}
                        : onChange(value + 0.01)
                    }
                    accessible={true}
                    style={styles.stepperRight}
                  >
                    <Icon
                      name="plus"
                      size={31}
                      style={adjustmentError ? styles.disabled : undefined}
                    />
                  </View>
                </Box>
              ) : (
                <Box align="center" style={{ height: 95 }}>
                  <H1 qaName="paycheckPercentage" center size={48} height={38}>
                    <Percentage whole>{percent}</Percentage>
                  </H1>
                  <Text center weight="medium" size="nav">
                    {percentLegend}
                  </Text>
                  <Text center size="small" color="error" py={1}>
                    {adjustmentError}
                  </Text>
                </Box>
              )}
              <Divider height={2} />
              <Box pt={3} pb={1} row>
                <Icon
                  fill={colors.ink}
                  dynamicRules={{ paths: { fill: colors.ink } }}
                  size={40}
                  name="coins"
                />
                <Text ml={2} qaName="monthlyPayment" flex={1}>
                  {description}
                </Text>
              </Box>
              <Box
                style={{ position: 'absolute', top: space[2], right: space[2] }}
              >
                {infoComponent && (
                  <FeatureTooltip>{infoComponent}</FeatureTooltip>
                )}
                {infoText && (
                  <FeatureTooltip>
                    <Text>{infoText}</Text>
                  </FeatureTooltip>
                )}
              </Box>
            </Box>
          </React.Fragment>
        )}
      </Box>
    );
  }
}

export default ResultCard;
