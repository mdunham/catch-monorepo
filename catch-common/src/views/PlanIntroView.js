import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Box,
  H3,
  Page,
  PageWrapper,
  animations,
  Icon,
  Paper,
  withDimensions,
  colors,
  styles,
} from '@catch/rio-ui-kit';

import { PlanIntroIconGroup } from '../components';

const viewStyles = StyleSheet.create({
  healthFlag: {
    borderRadius: 56,
    backgroundColor: colors['sage+1'],
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 4,
    paddingBottom: 4,
    marginBottom: 16,
  },
  bottomAction: {
    borderTopWidth: 1,
    borderTopColor: colors['ink+3'],
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingLeft: 16,
    paddingRight: 16,
  },
});

const PREFIX = 'catch.plans.PlanIntroView';
export const COPY = {
  finishButton: <FormattedMessage id={`${PREFIX}.finishButton`} />,
  startButton: <FormattedMessage id={`${PREFIX}.startButton`} />,
  underline: <FormattedMessage id={`${PREFIX}.underline`} />,
  underlineTimeoff: <FormattedMessage id={`${PREFIX}.underlineTimeoff`} />,
};

export class PlanIntro extends React.Component {
  static propTypes = {
    hasGoal: PropTypes.bool,
    planName: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
    title: PropTypes.object,
    introText: PropTypes.object,
    step1Text: PropTypes.object,
    step2Text: PropTypes.object,
    step3Text: PropTypes.object,
    step4Text: PropTypes.object,
    hasBankLinked: PropTypes.bool,
  };
  componentDidMount() {
    if (Platform.OS === 'web')
      window.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    if (Platform.OS === 'web')
      window.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyUp = ({ key }) => {
    if (key === 'Enter') {
      this.props.onNext();
    }
  };
  render() {
    const {
      hasGoal,
      planName,
      onNext,
      title,
      introText,
      step1Text,
      step2Text,
      step3Text,
      step4Text,
      hasBankLinked,
      viewport,
      size,
      ctaText,
      children,
      ...rest
    } = this.props;

    return (
      <SafeAreaView style={styles.get(['Flex1', 'FullWidth'])}>
        <ScrollView contentContainerStyle={styles.get(['CenterColumn'])}>
          <View
            style={styles.get(
              [
                'FullWidth',
                'PageMax',
                viewport !== 'PhoneOnly' && 'TopSpace',
                'CenterColumn',
              ],
              viewport,
            )}
          >
            <View
              style={styles.get(
                [
                  'CenterFrameWide',
                  'CenterColumn',
                  viewport === 'PhoneOnly' && !children
                    ? {
                        height: size.window.height - 54,
                      }
                    : 'LgBottomGutter',
                ],
                viewport,
              )}
            >
              <View style={styles.get(['BottomGutter'])}>
                <Icon name={planName} size={54} />
              </View>
              <Text style={styles.get(['H3S', 'BottomGutter'], viewport)}>
                {title}
              </Text>
              {planName === 'health' ? (
                <View style={viewStyles.healthFlag}>
                  <Text style={styles.get(['Body', 'CenterText'], viewport)}>
                    {introText}
                  </Text>
                </View>
              ) : (
                <Text
                  style={styles.get(
                    [
                      'Body',
                      'CenterText',
                      'BottomGutter',
                      'SmMargins',
                      planName === 'health' && viewStyles.healthFlag,
                    ],
                    viewport,
                  )}
                >
                  {introText}
                </Text>
              )}
              <PlanIntroIconGroup
                planName={planName}
                copy={{
                  bank: step1Text,
                  map: step2Text,
                  pig: step3Text,
                  last: step4Text,
                }}
                viewport={viewport}
                hasBankLinked={hasBankLinked}
              />
              {viewport !== 'PhoneOnly' && (
                <View style={styles.get('CenterColumn')}>
                  <Button onClick={onNext} viewport={viewport}>
                    {ctaText ||
                      (hasGoal ? COPY['finishButton'] : COPY['startButton'])}
                  </Button>
                </View>
              )}
              {planName !== 'health' && (
                <Box mt={3}>
                  <Text
                    style={styles.get(
                      ['Body', 'SubtleText', 'CenterText'],
                      viewport,
                    )}
                  >
                    {planName === 'timeoff'
                      ? COPY['underlineTimeoff']
                      : COPY['underline']}
                  </Text>
                </Box>
              )}
            </View>
          </View>
          {children}
        </ScrollView>
        {viewport === 'PhoneOnly' && (
          <View style={viewStyles.bottomAction}>
            <View style={styles.get(['FullWidth', 'ButtonMax'])}>
              <Button wide onClick={onNext}>
                {ctaText ||
                  (hasGoal ? COPY['finishButton'] : COPY['startButton'])}
              </Button>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const Component = withDimensions(PlanIntro);

Component.displayName = 'PlanIntro';

export default Component;
