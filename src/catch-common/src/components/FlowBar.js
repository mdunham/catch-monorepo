import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { branch, renderNothing } from 'recompose';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { compose } from 'redux';

import {
  Text,
  Box,
  Icon,
  PageWrapper,
  Page,
  colors,
  size,
  zIndex,
  animations,
  withDimensions,
  styles as st,
} from '@catch/rio-ui-kit';
import Env from 'exenv';
import { Env as REnv } from '@catch/utils';

// Creates root node to render modals into if it doesnt exist
function createRoot(id = 'rio-flowbar-root') {
  const node = document.createElement('div');
  node.setAttribute('id', id);
  node.setAttribute('style.z-index', zIndex.modal);
  return node;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors['sage+2'],
    paddingLeft: REnv.isDesktop ? size.navbarPaddingLeft : 0,
    zIndex: zIndex.modal,
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors['sage'],
    ...animations.fade,
  },
  mobileContainer: {
    height: 54,
  },
  desktopContainer: {
    height: 64,
  },
  paycheck: {
    backgroundColor: '#F9FAFA',
  },
  close: {
    width: 12,
    height: 12,
  },
  inner: { height: 70 },
  track: {
    position: 'absolute',
    left: 0,
    bottom: -6,
    right: 0,
    height: 6,
    width: '100%',
    backgroundColor: colors.sage,
  },
  progress: {
    position: 'absolute',
    left: 0,
    bottom: -6,
    height: 6,
    backgroundColor: colors['sage-1'],
  },
  white: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors['ink+3'],
  },
});

class FlowBar extends React.PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    push: PropTypes.func.isRequired,
    exitPath: PropTypes.string.isRequired,
  };
  static defaultProps = {
    exitPath: '/',
    total: 3,
    step: 1,
    showProgress: true,
  };
  constructor(props) {
    super(props);
    if (Env.canUseDOM) {
      this.el = document.createElement('div');
    }
  }
  // before mounting, ensure we have a root DOM node to render our portal in
  componentWillMount() {
    // we in a web environment or what??
    if (Env.canUseDOM) {
      this.modalRoot = document.getElementById('rio-flowbar-root');
      if (!this.modalRoot) {
        this.modalRoot = createRoot();
        document.body.appendChild(this.modalRoot);
      }
    }
  }

  componentDidMount() {
    if (Env.canUseDOM) {
      this.modalRoot.appendChild(this.el);
    }
  }

  componentWillUnmount() {
    if (Env.canUseDOM) {
      this.modalRoot.removeChild(this.el);
    }
  }
  render() {
    const {
      title,
      push,
      exitPath,
      style,
      viewport,
      total,
      step,
      breakpoints,
      showProgress,
      white,
    } = this.props;

    const progNum = (step / total) * 100;

    return ReactDOM.createPortal(
      <View
        style={st.get([
          styles.base,
          'CenterColumn',
          breakpoints.select({
            'PhoneOnly|TabletPortraitUp': styles.mobileContainer,
            TabletLandscapeUp: styles.desktopContainer,
          }),
          white && styles.white,
          style,
        ])}
      >
        <View style={st.get(['ContainerRow', 'PageMax', 'Margins'], viewport)}>
          <View style={st.get('CenterLeftRow')}>
            <Icon
              name="logo"
              size={32}
              onClick={() => push(exitPath)}
              fill={colors.ink}
              style={{
                ...animations.fade,
              }}
            />

            <Text style={st.get(['Body', 'Medium', 'LgLeftGutter'], viewport)}>
              {title}
            </Text>
          </View>
        </View>
        {showProgress && (
          <React.Fragment>
            <View style={styles.track} />
            <View style={[styles.progress, { width: `${progNum}%` }]} />
          </React.Fragment>
        )}
      </View>,
      this.el,
    );
  }
}

const withRedux = connect(
  undefined,
  { push },
);

const enhance = compose(
  withDimensions,
  withRedux,
);

const Component = enhance(FlowBar);

Component.displayName = 'FlowBar';

export default Component;
