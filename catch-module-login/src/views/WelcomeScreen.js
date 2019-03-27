import React from 'react';
import { View, Text, StyleSheet, Easing, Animated } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { debounce } from 'lodash';

import { withDimensions, Figure, styles as st } from '@catch/rio-ui-kit';

const PREFIX = 'catch.module.login.WelcomeConfettis';
const COPY = {
  title: values => <FormattedMessage id={`${PREFIX}.title`} values={values} />,
};

export class WelcomeScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(1),
    };
  }
  handleFadeOut = () => {
    Animated.timing(this.state.opacity, {
      toValue: 0,
      timing: 200,
      delay: 2000,
      easing: Easing.ease,
    }).start(this.props.onContinue);
  };
  componentDidMount() {
    this.handleFadeOut();
  }
  render() {
    const { viewport, givenName } = this.props;
    return (
      <Animated.View
        style={st.get(
          [
            styles.container,
            styles[`${viewport}Container`],
            'Margins',
            { opacity: this.state.opacity },
          ],
          viewport,
        )}
      >
        <View style={st.get('BottomGutter')}>
          <Figure name="party" />
        </View>
        <Text style={st.get(['H2S', 'CenterText', 'XlTopGutter'], viewport)}>
          {COPY['title']({ name: givenName })}
        </Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 200,
  },
  PhoneOnlyContainer: {
    paddingTop: 60,
  },
});

const Component = withDimensions(WelcomeScreen);

Component.displayName = 'WelcomeScreen';

export default Component;
