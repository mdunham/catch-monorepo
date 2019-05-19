/**
 * This is to be reused between web and native
 * in the future
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Platform } from 'react-native';

import { createLogger } from '../logger';

const Log = createLogger('idle');

// Convert to string to do deep compare
const eventsChanged = (yeoldevents, yonnewevents) =>
  yeoldevents.sort().toString() !== yonnewevents.sort().toString();

class Idle extends React.PureComponent {
  // In case we want to customize those values
  // and change them between our different environments
  static propTypes = {
    // We can override this and decide we are idle for whatever reason
    defaultIdle: PropTypes.bool,
    // If we need to pass those values somewhere
    children: PropTypes.func,
    // We can just pass this to our redux store
    onChange: PropTypes.func,
    // We can setup a pre idle method to warn our user
    onWarn: PropTypes.func,
    // TBD
    timeout: PropTypes.number,
    // these can be changed depending on web and native apis
    events: PropTypes.array,
  };
  static defaultProps = {
    defaultIdle: false,
    children: () => null,
    onChange: () => {},
    timeout: 120000,
    preTimeout: 60000,
    events: ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'],
  };

  constructor(props) {
    super(props);
    this.state = {
      idle: props.defaultIdle,
      warning: false,
    };
  }

  timeout = null;
  preTimeout = null;

  componentDidMount() {
    this.attachEvents();
    this.setTimeouts();
  }

  componentWillUnmount() {
    this.removeEvents();
    clearTimeout(this.timeout);
    if (this.preTimeout) clearTimeout(this.preTimeout);
  }

  componentDidUpdate(prevProps) {
    if (eventsChanged(prevProps.events, this.props.events)) {
      this.removeEvents();
      this.attachEvents();
    }
  }

  attachEvents = Platform.select({
    web: _ => {
      this.props.events.forEach(event => {
        window.addEventListener(event, this.handleEvent, true);
      });
    },
    // TODO
    default: _ => {},
  });

  removeEvents = Platform.select({
    web: _ => {
      this.props.events.forEach(event => {
        window.removeEventListener(event, this.handleEvent, true);
      });
    },
    // TODO
    default: _ => {},
  });

  handleChange = idle => {
    this.props.onChange({ idle });
    this.setState({ idle });
  };

  handleWarn = warning => {
    Log.debug('idle warning');
    this.props.onWarn({ warning });
    this.setState({ warning });
  };

  // If an event is triggered we're not iddle
  handleEvent = () => {
    if (this.state.idle) {
      this.handleChange(false);
    }
    if (this.state.warning) {
      this.handleWarn(false);
    }
    clearTimeout(this.timeout);
    if (this.preTimeout) clearTimeout(this.preTimeout);
    this.setTimeouts();
  };

  setTimeouts = _ => {
    this.timeout = setTimeout(() => {
      this.handleChange(true);
    }, this.props.timeout);

    if (this.props.onWarn) {
      this.preTimeout = setTimeout(() => {
        this.handleWarn(true);
      }, this.props.timeout - this.props.preTimeout);
    }
  };

  render() {
    return this.props.children(this.state);
  }
}

export default Idle;
