import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  ScrollView,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  Box,
  Button,
  colors,
  animations,
  PageWrapper,
  styles,
  Spinner,
  CenterFrame,
  withDimensions,
} from '@catch/rio-ui-kit';

import FlowBar from './FlowBar';

const PREFIX = 'catch.plans.FlowLayout';
export const COPY = {
  buttonBack: <FormattedMessage id={`${PREFIX}.buttonBack`} />,
  buttonNext: <FormattedMessage id={`${PREFIX}.buttonNext`} />,
  submitButton: <FormattedMessage id={`${PREFIX}.submitButton`} />,
};

const BAR_HEIGHT = 78;

const localStyles = {
  bar: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: colors.gray5,
    height: BAR_HEIGHT,
    justifyContent: 'space-around',
  },
  content: {
    paddingBottom: BAR_HEIGHT,
    flex: 1,
    ...animations.fadeInNext,
  },
};

export class FlowLayout extends React.PureComponent {
  static propTypes = {
    canClickBack: PropTypes.bool,
    canClickNext: PropTypes.bool,
    children: PropTypes.node.isRequired,
    isLastStep: PropTypes.bool,
    nextButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    onBack: PropTypes.func,
    onBackRight: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onBackRightButtonText: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.bool,
    ]),
    onNext: PropTypes.func,
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    viewTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    isLoading: PropTypes.bool,
    nextQAButtonName: PropTypes.string,
  };

  static defaultProps = {
    canClickBack: true,
    canClickNext: false,
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
    const { onNext, canClickNext } = this.props;
    if (key === 'Enter' && canClickNext) {
      onNext();
    }
  };

  renderNextButtonText = () => {
    const { isLastStep, nextButtonText } = this.props;

    if (!!nextButtonText) return nextButtonText;
    if (!!isLastStep) return COPY['submitButton'];
    return COPY['buttonNext'];
  };

  render() {
    const {
      canClickNext,
      canClickBack,
      children,
      isLastStep,
      nextButtonText,
      onBack,
      onBackRight,
      onBackRightButtonText,
      onNext,
      subtitle,
      viewTitle,
      buttonColor,
      isLoading,
      nextQAButtonName,
      footer,
      viewport,
    } = this.props;

    return (
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        style={styles.get('Flex1')}
      >
        <ScrollView
          contentContainerStyle={styles.get(['CenterColumn', 'FullWidth'])}
        >
          {children}
          {footer}
        </ScrollView>
        <SafeAreaView style={localStyles.bar}>
          <PageWrapper horizontal>
            {(!!onBack || !!onNext) && (
              <Box
                row
                align="center"
                {...Platform.select({ default: { justify: 'center' } })}
              >
                {/**
                  @NOTE:
                  Support for onBack is not good enough across plans so
                  we are temporarily removing the button to avoid inconsistencies
                  !!onBack &&
                  Platform.OS === 'web' && (
                    <Button
                      qaName="backButton"
                      onClick={onBack}
                      disabled={!canClickBack}
                      viewport={viewport}
                      type="light"
                    >
                      {COPY['buttonBack']}
                    </Button>
                  ) */}
                {!!onBackRight &&
                  Platform.OS === 'web' && (
                    <Box
                      {...Platform.select({
                        web: { ml: onNext ? 'auto' : 0, mr: 2 },
                      })}
                    >
                      <Button
                        light
                        qaName="backButton"
                        onClick={onBackRight}
                        disabled={!canClickBack}
                        viewport={viewport}
                      >
                        {onBackRightButtonText}
                      </Button>
                    </Box>
                  )}
                {!!onNext && (
                  <Box
                    {...Platform.select({
                      web: {
                        mr: !!onBackRight ? 0 : null,
                        ml: !onBackRight ? 'auto' : 0,
                      },
                      default: {
                        w: 1,
                      },
                    })}
                  >
                    <Button
                      color={buttonColor}
                      onClick={onNext}
                      disabled={isLoading || !canClickNext}
                      qaName={
                        !!nextQAButtonName ? nextQAButtonName : 'nextButton'
                      }
                      wide={Platform.OS !== 'web'}
                      loading={isLoading}
                      viewport={viewport}
                    >
                      {this.renderNextButtonText()}
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </PageWrapper>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

const Component = withDimensions(FlowLayout);

Component.displayName = 'FlowLayout';

export default Component;
