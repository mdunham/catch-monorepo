import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';

import { styles, withDimensions } from '@catch/rio-ui-kit';
import { goTo, getRouteState } from '@catch/utils';

import {
  PaycheckIntro,
  CenterFrame,
  BalanceWarningModal,
  PaycheckProcessed,
} from '../components';
import { IncomeTransaction } from '../containers';
import COPY from '../copy';

export class PaycheckIntroView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
    this.getRouteState = getRouteState.bind(this);
  }
  handleReject = () => {
    const { paycheckId } = this.props;
    this.goTo(`/paycheck/${paycheckId}/reject`);
  };
  handleApprove = workType => {
    const paycheckId = this.paycheckId;
    if (workType === 'WORK_TYPE_DIVERSIFIED') {
      if (Platform.OS === 'web') {
        this.goTo(`/paycheck/${paycheckId}/triage`);
      } else {
        this.goTo(['/paycheck', '/triage'], { paycheckId });
      }
    } else {
      if (Platform.OS === 'web') {
        this.goTo(`/paycheck/${paycheckId}/breakdown`);
      } else {
        this.goTo(['/paycheck', '/breakdown'], { paycheckId });
      }
    }
  };
  get paycheckId() {
    if (Platform.OS === 'web') {
      return this.props.paycheckId;
    } else {
      return this.getRouteState().paycheckId;
    }
  }
  render() {
    const { breakpoints } = this.props;
    const paycheckId = this.paycheckId;
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
        <IncomeTransaction id={paycheckId}>
          {({
            loading,
            error,
            amount,
            date,
            description,
            workType,
            syncStatus,
            bankName,
            actedOn,
            txStatus,
          }) =>
            loading ? null : actedOn ? (
              <CenterFrame
                breakpoints={breakpoints}
                actions={[{ text: 'Got it', onPress: () => this.goTo(['/']) }]}
              >
                <PaycheckProcessed
                  onInfo={() => this.goTo(['/plan'])}
                  incomeAction={txStatus}
                  date={actedOn}
                />
              </CenterFrame>
            ) : (
              <CenterFrame
                breakpoints={breakpoints}
                actions={[
                  { text: 'No', onPress: this.handleReject },
                  { text: 'Yes', onPress: () => this.handleApprove(workType) },
                ]}
              >
                <PaycheckIntro
                  amount={amount}
                  date={date}
                  description={description}
                  loading={loading}
                />
                {!loading &&
                  syncStatus !== 'GOOD' && (
                    <BalanceWarningModal
                      title={COPY['BankSyncErrorModal.title']}
                      paragraphs={[
                        COPY['BankSyncErrorModal.p1']({ bankName }),
                        COPY['BankSyncErrorModal.p2'],
                      ]}
                      dismissText={COPY['BankSyncErrorModal.dismissText']}
                      confirmText={COPY['BankSyncErrorModal.updateText']}
                      onDismiss={() => this.goTo(['/'])}
                      onConfirm={() => this.goTo(['/link-bank'])}
                      viewport={breakpoints.current}
                    />
                  )}
              </CenterFrame>
            )
          }
        </IncomeTransaction>
      </View>
    );
  }
}

export default withDimensions(PaycheckIntroView);
