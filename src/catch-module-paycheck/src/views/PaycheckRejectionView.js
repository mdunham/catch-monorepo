import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';

import { styles, withDimensions } from '@catch/rio-ui-kit';
import { goTo, getRouteState } from '@catch/utils';

import { ProcessIncomeTransaction, IncomeTransaction } from '../containers';
import {
  PaycheckRejection,
  CenterFrame,
  PaycheckProcessed,
} from '../components';

export class PaycheckRejectionView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      rejected: false,
    };
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
  }
  onReject = () => {
    this.setState({
      rejected: true,
    });
  };
  handleExit = () => {
    this.goTo(['/']);
  };
  get paycheckId() {
    if (Platform.OS === 'web') {
      return this.props.paycheckId;
    } else {
      return this.getRouteState().paycheckId;
    }
  }
  get isW2() {
    const routeState = this.getRouteState();
    if (routeState && routeState.isW2) {
      return true;
    }
    return false;
  }
  render() {
    const { breakpoints } = this.props;
    const paycheckId = this.paycheckId;
    const isW2 = this.isW2;
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
          // avoids passing the viewport size for mobile viewport
          breakpoints.select({
            'TabletLandscapeUp|TabletPortraitUp': breakpoints.current,
          }),
        )}
      >
        <IncomeTransaction id={paycheckId}>
          {({ actedOn, txStatus }) =>
            // We don't want to set the acted on state if the user just rejected the
            // paycheck
            actedOn && !this.state.rejected ? (
              <CenterFrame
                breakpoints={breakpoints}
                actions={[{ text: 'Got it', onPress: this.handleExit }]}
              >
                <PaycheckProcessed incomeAction={txStatus} date={actedOn} />
              </CenterFrame>
            ) : (
              <CenterFrame
                breakpoints={breakpoints}
                actions={[{ text: 'Done', onPress: this.handleExit }]}
              >
                <ProcessIncomeTransaction>
                  {({ process, loading }) => (
                    <PaycheckRejection
                      onReject={async () => {
                        await process({
                          variables: {
                            incomeInput: {
                              transactionID: paycheckId,
                              isApproved: false,
                            },
                          },
                        }).catch(e => e);
                        this.onReject();
                      }}
                      isW2={isW2}
                      loading={loading}
                    />
                  )}
                </ProcessIncomeTransaction>
              </CenterFrame>
            )
          }
        </IncomeTransaction>
      </View>
    );
  }
}

export default withDimensions(PaycheckRejectionView);
