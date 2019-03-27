import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Platform } from 'react-native';
import { debounce } from 'lodash';

import { createLogger } from '../../util/logger';
import Paper from '../Paper';
import Text from '../Text';

import TooltipContainer, { directions } from './TooltipContainer';

const Log = createLogger('tooltip');

/**
 * Keeps track of the tooltip state
 * TODO:
 * - handle native events
 * - set isOpen state via props
 * - smoother transitions when tooltip opens
 */
class Tooltip extends React.PureComponent {
  static propTypes = {
    // not necessary as the container defaults to BOTTOM
    direction: PropTypes.oneOf([
      directions.TOP,
      directions.RIGHT,
      directions.BOTTOM,
      directions.LEFT,
    ]),
    // In case we need to adjust the position
    tooltipOffset: PropTypes.oneOfType([
      PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
      }),
      PropTypes.func,
    ]),
    // We can set that up based on platform
    // though need to figure out how tap outside in native
    clickToOpen: PropTypes.bool,
    // required
    triggerComponent: PropTypes.object.isRequired,
    children: PropTypes.object.isRequired,
  };
  _hasContextMenu = false;

  _tooltipEl = null;

  state = {
    isOpen: false,
  };

  componentDidMount() {
    document.addEventListener('touchend', this.handleDocumentTouch, true);
  }

  componentWillUnmount() {
    document.removeEventListener('touchend', this.handleDocumentTouch, true);
  }

  handleDocumentTouch = e => {
    // IF the ref is defined it means the tooltip is showing
    if (this._tooltipEl) {
      this.setState({ isOpen: false });
    }
  };

  getTriggerPosition = () => {
    if (this.triggerEl && this.triggerEl.measureInWindow) {
      this.triggerEl.measureInWindow((x, y, width, height) => {
        const triggerPosition = {
          top: y,
          right: x + width,
          bottom: y + height,
          left: x,
        };
        this.setState({ triggerPosition });
      });
    }
  };

  handleHover = (mouseState, relatedTarget) => {
    if (mouseState === 'over') {
      this.getTriggerPosition();
      this.setState({ isOpen: true });
    } else {
      const shouldPreventClose = false;
      // There's some tweaking to do here to get perfect UX
      if (!shouldPreventClose) {
        this.setState({ isOpen: false });
      }
    }
  };

  debounceHandleOver = debounce(this.handleHover, 50);

  handleMouse = e => {
    const mouseState =
      typeof e === 'string'
        ? e
        : { mouseover: 'over', mouseout: 'out', focus: 'over', blur: 'out' }[
            e.type
          ];
    const hadContextMenu = this._hasContextMenu;
    this._hasContextMenu = e.type === 'contextmenu';

    // @NOTE Will be a press in native
    if (this.props.clickToOpen) {
      if (mouseState === 'click') {
        const shouldOpen = !this.state.isOpen;
        if (shouldOpen) {
          this.getTriggerPosition();
        }
        this.setState({ isOpen: shouldOpen });
      }
    } else if (!!mouseState && (mouseState !== 'out' || !hadContextMenu)) {
      this.debounceHandleOver(mouseState, e.relatedTarget);
    }
  };
  render() {
    const {
      triggerComponent,
      children,
      direction,
      tooltipOffset,
      ...other
    } = this.props;
    const { isOpen } = this.state;
    return (
      <View>
        <View
          onMouseOver={this.handleMouse}
          onMouseOut={this.handleMouse}
          onFocus={this.handleMouse}
          onBlur={this.handleMouse}
          onClick={this.handleMouse}
          ref={node => (this.triggerEl = node)}
        >
          {triggerComponent}
        </View>
        {isOpen && (
          <TooltipContainer
            tooltipPosition={this.state.triggerPosition}
            tooltipRef={node => (this._tooltipEl = node)}
            tooltipDirection={direction}
            tooltipOffset={tooltipOffset}
          >
            <View
              onMouseOver={this.handleMouse}
              onMouseOut={this.handleMouse}
              onFocus={this.handleMouse}
              onBlur={this.handleMouse}
              onContextMenu={this.handleMouse}
            >
              <Paper {...other}>{children}</Paper>
            </View>
          </TooltipContainer>
        )}
      </View>
    );
  }
}

export default Tooltip;
