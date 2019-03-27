import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';

import { LargeBlob, styles, withDimensions, Button } from '@catch/rio-ui-kit';

import { goTo } from '@catch/utils';

export class PlanIntroView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }
  componentDidMount() {
    this.handleFadeIn();
  }
  handleFadeIn = () => {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      timing: 200,
      easing: Easing.ease,
    }).start();
  };
  handleStart = () => {
    this.goTo('/guide/checkup');
  };
  render() {
    const { viewport, legacy, onSkipCheckup, breakpoints } = this.props;
    return (
      <Animated.View
        style={styles.get(
          [
            'CenterColumn',
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': 'TopSpace',
            }),
            'Margins',
            { opacity: this.state.opacity },
          ],
          viewport,
        )}
      >
        <View
          style={styles.get([
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': 'LgTopGutter',
            }),
            'XlBottomGutter',
          ])}
        >
          <LargeBlob name="plan-chart" viewport={viewport} />
        </View>
        {legacy ? (
          <React.Fragment>
            <Text style={styles.get(['H2S', 'CenterText'], viewport)}>
              This just in
            </Text>
            <Text
              style={styles.get(
                ['Body', 'CenterText', 'LgBottomGutter', 'ContentMax'],
                viewport,
              )}
            >
              Explore custom recommendations with the new benefits guide. Start
              by answering a few questions and we’ll explore how your current
              benefits measure up.
            </Text>
            <Button viewport={viewport} onClick={this.handleStart}>
              Get started
            </Button>
            <Text
              onPress={onSkipCheckup}
              style={styles.get(
                ['BodyLink', 'XlTopGutter', 'XlBottomGutter', 'CenterText'],
                viewport,
              )}
            >
              Skip for now
            </Text>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Text style={styles.get(['H2S', 'CenterText'], viewport)}>
              Your plan
            </Text>
            <Text
              style={styles.get(
                ['Body', 'CenterText', 'LgBottomGutter', 'ContentMax'],
                viewport,
              )}
            >
              Build and manage your personal benefits package. Start by
              answering a few questions to complete your benefits checkup.
            </Text>
            <Button viewport={viewport} onClick={this.handleStart}>
              Get started
            </Button>
          </React.Fragment>
        )}
      </Animated.View>
    );
  }
}

const Component = withDimensions(PlanIntroView);

Component.displayName = 'PlanIntroView';

export default Component;
