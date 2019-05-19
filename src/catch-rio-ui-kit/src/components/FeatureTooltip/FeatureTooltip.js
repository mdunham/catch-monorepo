import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View } from 'react-native';

import Modal from '../Modal';
import Icon from '../Icon';
import Box from '../Box';
import { colors, space } from '../../const';
import { withDimensions } from '../../tools';
import styles from '../../styles';

export class FeatureTooltip extends React.PureComponent {
  state = {
    showTooltip: false,
  };
  toggleTooltip = _ => {
    this.setState(({ showTooltip }) => ({
      showTooltip: !showTooltip,
    }));
  };
  render() {
    const { children, viewport } = this.props;

    return (
      <React.Fragment>
        <Icon
          name="info"
          size={17}
          fill="transparent"
          onClick={this.toggleTooltip}
        />
        {this.state.showTooltip && (
          <Modal
            onRequestClose={this.toggleTooltip}
            viewport={viewport}
            style={{
              width: viewport === 'PhoneOnly' ? '100%' : 450,
            }}
          >
            <Box p={2} pb={1} w={1} align="flex-end">
              <Icon
                name="close"
                size={20}
                fill={colors.gray3}
                stroke={colors.gray3}
                strokeWidth={2}
                dynamicRules={{ paths: { fill: colors.gray3 } }}
                onClick={this.toggleTooltip}
              />
            </Box>
            <ScrollView>
              <View
                style={styles.get(['Margins', 'BottomSpace'], viewport)}
                onStartShouldSetResponder={() => true}
              >
                {children}
              </View>
            </ScrollView>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

const Component = withDimensions(FeatureTooltip);
Component.displayName = 'FeatureTooltip';

export default Component;
