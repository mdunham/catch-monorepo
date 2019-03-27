import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, Dimensions } from 'react-native';
import {
  Box,
  Text,
  Icon,
  zIndex,
  shadow,
  fonts,
  fontColors,
  borderRadius,
  colors,
  size,
} from '@catch/rio-ui-kit';
import { Progress } from '..';

/**
 * Toast still needs to be developed and documented.
 */
class Toast extends React.PureComponent {
  state = {
    isRunning: true,
  };

  static propTypes = {
    onClose: PropTypes.func,
    /** Pause the closing progress when hovering over to read the toast */
    pauseOnHover: PropTypes.bool,
    /** Amount of time toast appears until it's onClose is called*/
    autoCloseIn: PropTypes.number,
    /** If true, an 'X' will appear for user to close faster than progress bar */
    closeable: PropTypes.bool,
    /** If true, toast will close after autoCloseIn but no progress bar will be shown */
    hideProgressBar: PropTypes.bool,
    /** Optional css extension */
    children: PropTypes.node,
  };

  static defaultProps = {
    onClose: () => {},
    pauseOnHover: true,
    autoCloseIn: 6000,
    closeable: false,
    hideProgressBar: false,
  };

  toggleProgress = () => {
    if (this.props.pauseOnHover) {
      this.setState({ isRunning: !this.state.isRunning });
    }
  };

  render() {
    const {
      type,
      title,
      msg,
      children,
      closeable,
      onClose,
      hideProgressBar,
      autoCloseIn,
    } = this.props;

    return (
      <Box
        p={2}
        onMouseEnter={this.toggleProgress}
        onMouseLeave={this.toggleProgress}
        style={[styles.base]}
      >
        {!!title && (
          <Box mb={1} row align="center">
            {type === 'success' && (
              <Icon
                name="success-check"
                size={18}
                style={{ marginRight: 10 }}
              />
            )}
            {type === 'processing' && (
              <Icon
                name="clock"
                size={18}
                dynamicRules={{ paths: { fill: colors.smoke } }}
                fill={colors.smoke}
                style={{ marginRight: 10 }}
              />
            )}
            {type === 'gift' && (
              <Icon
                name="gift"
                size={18}
                dynamicRules={{ paths: { fill: colors['algae'] } }}
                fill={colors['algae']}
                style={{ marginRight: 10 }}
              />
            )}
            {type === 'person' && (
              <Icon name="person" size={18} style={{ marginRight: 10 }} />
            )}
            <Text weight="bold">{title}</Text>
          </Box>
        )}
        <Text size="small">{msg}</Text>
        {closeable && (
          <Box style={styles.closeOuter}>
            <Icon
              name="close"
              size="form"
              fill={colors.white}
              stroke={colors.white}
              strokeWidth={2}
              onClick={onClose}
              style={styles.close}
            />
          </Box>
        )}
        {autoCloseIn > 0 && (
          <Progress
            isRunning={this.state.isRunning}
            duration={autoCloseIn}
            onAnimationEnd={onClose}
            hide={hideProgressBar}
          />
        )}
      </Box>
    );
  }
}

const WINDOW_WIDTH = Dimensions.get('window').width;

const styles = {
  base: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.regular,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors['ink+4'],
    marginLeft: 'auto',
    marginTop: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        maxWidth: 350,
        width: '100%',
      },
      default: {
        width: WINDOW_WIDTH > 358 ? 358 - 16 : WINDOW_WIDTH - 16,
      },
    }),
    zIndex: zIndex.toast,
    ...shadow.card,
  },
  close: {
    width: 12,
    height: 12,
    opacity: 0.65,
  },
  closeOuter: {
    position: 'absolute',
    right: 14,
    top: 17,
  },
};

export default Toast;
