import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import { Icon, styles as st, colors } from '@catch/rio-ui-kit';

import BackButton from './BackButton';

class PlanCheckupLayout extends React.PureComponent {
  static defaultProps = {
    progress: 0,
  };
  constructor(props) {
    super(props);
    this.state = {
      progressLength: new Animated.Value(-140),
    };
  }
  componentDidMount() {
    if (this.props.progress > 0) {
      this.animateProgress();
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.progress !== this.props.progress) {
      this.animateProgress();
    }
  }
  animateProgress = () => {
    const nextLength = 140 * this.props.progress;
    Animated.timing(this.state.progressLength, {
      toValue: nextLength - 140,
      duration: 300,
    }).start();
  };
  render() {
    const {
      viewport,
      children,
      onBack,
      renderBackButton,
      progress,
      loading,
      size,
    } = this.props;
    return (
      <SafeAreaView style={st.get(['Flex1', 'FullSize', 'Peach'], viewport)}>
        <KeyboardAvoidingView
          behavior={Platform.select({ ios: 'padding' })}
          style={st.get(['Flex1', 'FullSize'])}
        >
          <View
            style={st.get(['TopSpace', 'CenterColumn', 'FullSize'], viewport)}
          >
            {renderBackButton && <BackButton onClick={onBack} />}
            <View style={st.get(['CenterColumn', styles.header])}>
              <Icon size={Platform.select({ web: 52 })} name="checkup" />
              {loading ? (
                <Text
                  style={st.get(
                    ['Body', 'TopGutter', 'BottomGutter'],
                    viewport,
                  )}
                >
                  Preparing recommendations
                </Text>
              ) : (
                <React.Fragment>
                  <Text
                    style={st.get(
                      ['Body', 'TopGutter', 'BottomGutter'],
                      viewport,
                    )}
                  >
                    Benefits checkup
                  </Text>
                  <View style={styles.track}>
                    <Animated.View
                      style={[
                        styles.progress,
                        {
                          transform: [
                            { translateX: this.state.progressLength },
                          ],
                        },
                      ]}
                    />
                  </View>
                </React.Fragment>
              )}
            </View>
            <View style={styles.container}>{children}</View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  track: {
    height: 3,
    width: 140,
    backgroundColor: colors['peach+1'],
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    width: '100%',
    backgroundColor: colors['peach-1'],
  },
  header: {
    marginBottom: 64,
  },
});

export default PlanCheckupLayout;
