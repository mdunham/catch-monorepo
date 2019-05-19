import React, { createRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { createLogger } from '../../util/logger';
import Env from '../../util/env';
const Log = createLogger('tooltip-container');

export const directions = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
};

/**
 * Offset could change if we'd like to add an arrow or anyting next to the container
 *
 */
const hasChangeInOffset = (oldTooltipOffset = {}, tooltipOffset = {}) => {
  if (typeof oldTooltipOffset !== typeof tooltipOffset) {
    return true;
  } else if (
    Object(tooltipOffset) === tooltipOffset &&
    typeof tooltipOffset !== 'function'
  ) {
    return (
      oldTooltipOffset.top !== tooltipOffset.top ||
      oldTooltipOffset.left !== tooltipOffset.left
    );
  }
  return oldTooltipOffset !== tooltipOffset;
};

/**
 * Utility function to tweak tooltip positions
 * this can be useful to adjust the tooltip based on scroll or in native tree etc.
 */
const getFloatingPosition = ({
  tooltipSize,
  refPosition,
  offset = {},
  direction = directions.BOTTOM,
  scrollY = 0,
}) => {
  const {
    left: refLeft = 0,
    top: refTop = 0,
    right: refRight = 0,
    bottom: refBottom = 0,
  } = refPosition;

  const { width, height } = tooltipSize;
  const { top = 0, left = 0 } = offset;
  const refCenterHorizontal = (refLeft + refRight) / 2;
  const refCenterVertical = (refTop + refBottom) / 2;

  return {
    [directions.LEFT]: () => ({
      left: refLeft - width - left,
      top: refCenterVertical + top + scrollY,
    }),
    [directions.TOP]: () => ({
      left: refLeft, // refCenterHorizontal - width / 2 + left,
      top: refTop - height - top + scrollY,
    }),
    [directions.RIGHT]: () => ({
      left: refLeft + width + left, // refRight + left,
      top: refCenterVertical + top + scrollY,
    }),
    [directions.BOTTOM]: () => ({
      left: refLeft + left, // refCenterHorizontal - width / 2 + left,
      top: refBottom + top + scrollY, // refBottom + scrollY + top,
    }),
  }[direction]();
};

/**
 * This takes care of rendering tooltips in a web or native (TODO) environment
 * We use a web portal for more flexibility in more complex layouts.
 */
class TooltipContainer extends React.Component {
  static propTypes = {
    children: PropTypes.object,
    target: PropTypes.func,
    tooltipDirection: PropTypes.oneOf([
      directions.TOP,
      directions.RIGHT,
      directions.BOTTOM,
      directions.LEFT,
    ]),
    tooltipOffset: PropTypes.oneOfType([
      PropTypes.shape({
        top: PropTypes.number,
        left: PropTypes.number,
      }),
      PropTypes.func,
    ]),
    tooltipPosition: PropTypes.shape({
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    tooltipRef: PropTypes.func,
  };

  static defaultProps = {
    tooltipPosition: {},
    tooltipOffset: {},
    tooltipDirection: directions.BOTTOM,
  };

  //position of the tooltip based on top left corner of viewport
  state = {
    floatingPosition: undefined,
  };

  _tooltipContainer = null;

  _tooltipBody = createRef();

  componentDidMount() {
    const { tooltipRef } = this.props;
    !!tooltipRef && tooltipRef(this._tooltipBody.current);
    this.updateTooltipSize();
  }

  componentDidUpdate(prevProps) {
    this.updateTooltipSize(prevProps);
  }

  componentWillUnmount() {
    const { tooltipRef } = this.props;
    !!tooltipRef && tooltipRef(null);
  }

  updateTooltipSize = (prevProps = {}) => {
    const tooltipBody = this._tooltipBody.current;
    // We check if it is inside a modal overlay as the measurement
    // will be different so we must compensate with a pageYOffset
    const isInModal = !!document.getElementById('rio-modal-root');
    if (!tooltipBody) {
      Log.debug('Dom node for tooltip body is not available');
      return;
    }

    const {
      tooltipPosition: oldRefPosition = {},
      tooltipOffset: oldTooltipOffset = {},
      tooltipDirection: oldTooltipDirection,
    } = prevProps;
    const {
      tooltipPosition: refPosition = {},
      tooltipOffset = {},
      tooltipDirection,
    } = this.props;

    if (
      oldRefPosition.top !== refPosition.top ||
      oldRefPosition.right !== refPosition.right ||
      oldRefPosition.bottom !== refPosition.bottom ||
      oldRefPosition.left !== refPosition.left ||
      hasChangeInOffset(oldTooltipOffset, tooltipOffset) ||
      oldTooltipDirection !== tooltipDirection
    ) {
      const offset =
        typeof tooltipOffset !== 'function'
          ? tooltipOffset
          : tooltipOffset(tooltipBody, tooltipDirection);

      if (typeof tooltipBody.measure === 'undefined') {
        Log.error('Please use a react-native-web primitive');
        return;
      }

      tooltipBody.measure((x, y, width, height) => {
        if ((width > 0 && height > 0) || !offset) {
          this.setState({
            floatingPosition: getFloatingPosition({
              tooltipSize: { width, height },
              refPosition,
              direction: tooltipDirection,
              offset,
              scrollY: Env.isSafari || isInModal ? window.pageYOffset : 0,
            }),
          });
        }
      });
    }
  };
  getChildrenWithProps = () => {
    const { style, children } = this.props;

    const { floatingPosition } = this.state;

    const positioningStyle = !!floatingPosition
      ? {
          left: floatingPosition.left,
          top: floatingPosition.top,
          right: 'auto',
        }
      : {
          visibility: 'hidden',
          top: 0,
        };

    return React.cloneElement(children, {
      ref: this._tooltipBody,
      style: {
        ...style,
        ...positioningStyle,
        position: 'absolute',
        margin: 0,
        opacity: 1,
        zIndex: 1000,
      },
    });
  };
  render() {
    if (typeof document !== 'undefined') {
      const { target } = this.props;
      return ReactDOM.createPortal(
        this.getChildrenWithProps(),
        !target ? document.body : target(),
      );
    }
    // TODO hanle native rendering here in the future
    return null;
  }
}

export default TooltipContainer;
