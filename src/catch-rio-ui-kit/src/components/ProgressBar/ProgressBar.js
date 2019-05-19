import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';

import Env from '../../util/env';

class ProgressBar extends React.PureComponent {
  static propTypes = {
    color: PropTypes.string,
    progress: PropTypes.number,
    trackColor: PropTypes.string,
    mode: PropTypes.oneOf(['loading', 'chart']),
  };

  static defaultProps = {
    progress: 0,
    mode: 'loading',
  };

  // TODO: we can add some animations here later on
  componentDidMount() {
    this._updateProgressWidth();
  }

  componentDidUpdate() {
    this._updateProgressWidth();
  }

  render() {
    const { color, mode, progress, trackColor, style, ...other } = this.props;

    const percentageProgress = progress * 100;

    return (
      <View
        {...other}
        accessibilityRole={Platform.select({ web: 'progressbar' })}
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow={percentageProgress}
        style={[
          styles.track,
          style,
          mode === 'loading' && styles.loadingTrack,
          mode === 'chart' && styles.chartTrack,
          trackColor && { backgroundColor: trackColor },
        ]}
      >
        <View
          ref={this._setProgressRef}
          style={[
            styles.progress,
            mode === 'loading' && styles.loadingProgress,
            mode === 'chart' && styles.chartProgress,
            color && { backgroundColor: color },
          ]}
        />
      </View>
    );
  }

  _setProgressRef = element => {
    this._progressElement = element;
  };

  _updateProgressWidth = () => {
    const { progress } = this.props;
    const percentageProgress = progress * 100;
    const width = `${percentageProgress}%`;
    if (this._progressElement && !Env.isTest) {
      this._progressElement.setNativeProps({
        style: { width },
      });
    }
  };
}

const styles = StyleSheet.create({
  track: {
    height: 4,
    width: '100%',
    overflow: 'hidden',
    ...Platform.select({ web: { userSelect: 'none' }, default: {} }),
    zIndex: 0,
  },
  progress: {
    height: '100%',
    zIndex: -1,
  },
  loadingTrack: {
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  loadingProgress: {
    backgroundColor: '#4983FF',
  },
  chartTrack: {
    borderRadius: 5,
    backgroundColor: 'rgba(63, 120, 242, 0.15)',
  },
  chartProgress: {
    borderRadius: 5,
    backgroundColor: '#789CFF',
  },
});

export default ProgressBar;
