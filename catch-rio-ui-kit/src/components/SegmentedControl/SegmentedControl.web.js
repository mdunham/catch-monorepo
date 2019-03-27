import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '../Text';
import { colors } from '../../const';

class SegmentedControl extends React.PureComponent {
  static propTypes = {
    controls: PropTypes.array,
  };
  state = {
    activeIdx: 0,
  };
  handlePress = idx => {
    this.setState({ activeIdx: idx });
  };
  render() {
    const { controls, children, style, ...other } = this.props;
    const { activeIdx } = this.state;
    return (
      <React.Fragment>
        <View style={style}>
          <View style={styles.container}>
            {controls.map((btn, i) => {
              const width = `${100 / controls.length}%`;
              return (
                <TouchableOpacity
                  key={`ctrl-${i}`}
                  onPress={() => this.handlePress(i)}
                  useForeground={true}
                  style={{ width }}
                >
                  <View
                    style={[
                      styles.baseButton,
                      i === 0 && styles.border,
                      activeIdx === i && styles.active,
                    ]}
                  >
                    <Text
                      px={2}
                      py={1}
                      color={activeIdx === i ? 'snow' : 'ink'}
                      center
                    >
                      {btn.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        {React.Children.map(children, (child, i) => {
          if (i === activeIdx) {
            return child;
          }
          return null;
        })}
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: colors.snow,
    borderWidth: 1,
    borderColor: colors.ink,
  },
  baseButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.snow,
  },
  border: {
    borderRightWidth: 1,
    borderRightColor: colors.ink,
  },
  active: {
    backgroundColor: colors.ink,
  },
});

export default SegmentedControl;
