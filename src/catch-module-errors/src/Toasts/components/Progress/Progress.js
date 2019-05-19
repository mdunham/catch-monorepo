import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';

/**
 * Progress bar that automatically gets smaller
 */

const Progress = ({ onAnimationEnd, duration, isRunning, hide, ...other }) => (
  <View
    style={[
      styles.base,
      { animationDuration: `${duration}ms` },
      hide && styles.hidden,
      !isRunning && styles.paused,
    ]}
    onAnimationEnd={onAnimationEnd}
  />
);

Progress.propTypes = {
  /** Callback for once it has gotten to 0 */
  onAnimationEnd: PropTypes.func.isRequired,
  /** Duration for progress bar to get to 0*/
  duration: PropTypes.number.isRequired,
  /** If true, let the progress css animation run */
  isRunning: PropTypes.bool.isRequired,
  /** A way to hide the progress bar but still call the onAnimationEnd callback once it reaches 0 */
  hide: PropTypes.bool,
};

Progress.defaultProps = {
  isRunning: true,
  hide: false,
  duration: 300,
};

const styles = StyleSheet.create({
  base: {
    height: '100%',
    position: 'absolute',

    bottom: 0,
    left: 0,
    width: 0,
    opacity: 0.1,
    backgroundColor: '#fff',
    animationPlayState: 'running',
    animationName: [
      {
        '0%': { width: '100%' },
        '100%': { width: 0 },
      },
    ],
    zIndex: 999, //not safe
  },
  hidden: {
    opacity: 0,
  },
  paused: {
    animationPlayState: 'paused',
  },
});

export default Progress;
