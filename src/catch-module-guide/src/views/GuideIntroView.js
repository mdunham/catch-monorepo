import React from 'react';
import { View, Text, Animated, Easing } from 'react-native';

import { LargeBlob, styles, withDimensions, Button } from '@catch/rio-ui-kit';

import { goTo } from '@catch/utils';

export class GuideIntroView extends React.PureComponent {
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
    const { viewport, breakpoints } = this.props;
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
          <LargeBlob viewport={viewport} name="guide" />
        </View>
        <Text style={styles.get(['H2S', 'CenterText'], viewport)}>
          Your guide
        </Text>
        <Text
          style={styles.get(
            ['Body', 'CenterText', 'LgBottomGutter', 'ContentMax'],
            viewport,
          )}
        >
          Explore custom recommendations through your benefits guide. Start by
          answering a few questions about your current benefits.
        </Text>
        <Button viewport={viewport} onClick={this.handleStart}>
          Get started
        </Button>
      </Animated.View>
    );
  }
}

const Component = withDimensions(GuideIntroView);

Component.displayName = 'GuideIntroView';

export default Component;
