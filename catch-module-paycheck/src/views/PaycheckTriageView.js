import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { debounce } from 'lodash';

import { styles, withDimensions } from '@catch/rio-ui-kit';
import { goTo, getRouteState } from '@catch/utils';

import { PaycheckTriage, CenterFrame } from '../components';

export class PaycheckTriageView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
    this.handleNext = debounce(this.handleNext.bind(this), 300);
  }
  handleNext() {
    const paycheckId = this.paycheckId;
    if (Platform.OS === 'web') {
      this.goTo(`/paycheck/${paycheckId}/breakdown`);
    } else {
      this.goTo(['/paycheck', '/breakdown'], { paycheckId });
    }
  }
  get paycheckId() {
    if (Platform.OS === 'web') {
      return this.props.paycheckId;
    } else {
      return this.getRouteState().paycheckId;
    }
  }
  render() {
    const { breakpoints } = this.props;
    return (
      <View
        style={styles.get(
          [
            'Container',
            'CenterColumn',
            breakpoints.select({
              'TabletLandscapeUp|TabletPortraitUp': 'TopSpace',
            }),
          ],
          breakpoints.select({
            'TabletLandscapeUp|TabletPortraitUp': breakpoints.current,
          }),
        )}
      >
        <CenterFrame breakpoints={breakpoints}>
          <PaycheckTriage onNext={this.handleNext} />
        </CenterFrame>
      </View>
    );
  }
}

export default withDimensions(PaycheckTriageView);
