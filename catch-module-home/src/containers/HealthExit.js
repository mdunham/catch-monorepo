import React from 'react';

import { SetRecommendationImportance } from '@catch/guide/src/containers';

import { HealthExitCard } from '../components';
import SaveEnrollment from './SaveEnrollment';

class HealthExit extends React.PureComponent {
  constructor(props) {
    super(props);
    const { exitState, exitOrigin } = this.props;
    this.state = {
      displayCard: exitState === 'ENROLL_NIL' && !!exitOrigin,
    };
  }
  handleExplore = () => {
    this.props.goTo('/plan/health/intro');
  };
  handleDismiss = () => {
    this.setState({
      displayCard: false,
    });
  };
  handleWallet = () => {
    const { exitOrigin, goTo } = this.props;
    switch (exitOrigin) {
      case 'MEDICAID':
      case 'MEDICARE':
      case 'STATE_EXCHANGE':
        goTo('/plan/health/wallet/add');
        break;
      case 'HEALTHCARE_GOV':
        goTo('/plan/health/wallet/intro');
        break;
    }
  };
  renderExitCard = ({ saveEnrollment }) => {
    const {
      exitState,
      exitOrigin,
      viewport,
      insuranceID,
      isCovered,
    } = this.props;

    const initialState = exitState === 'ENROLL_NIL';

    const sources = {
      MEDICARE: 'MEDICARE',
      MEDICAID: 'MEDICAID',
      STATE_EXCHANGE: 'SELF_EXCHANGE',
      HEALTHCARE_GOV: 'SELF_EXCHANGE',
    };

    const leftAction = initialState
      ? // No
        () =>
          saveEnrollment({
            variables: {
              enrollment: {
                didEnroll: 'NO',
              },
              source: {
                id: insuranceID,
              },
            },
          })
      : // Not now
        this.handleDismiss;
    const rightAction = initialState
      ? // Yes
        () =>
          saveEnrollment({
            variables: {
              enrollment: {
                didEnroll: 'YES',
              },
              source: {
                insuranceSource: sources[exitOrigin],
                id: insuranceID,
              },
            },
          })
      : // Not now
        this.handleWallet;
    return (
      <HealthExitCard
        state={exitState}
        viewport={viewport}
        origin={exitOrigin}
        isCovered={isCovered}
        onLeftAction={leftAction}
        onRightAction={rightAction}
        onDismiss={this.handleDismiss}
        onExplore={this.handleExplore}
      />
    );
  };
  render() {
    const { displayCard } = this.state;
    const { recID, children } = this.props;
    // The other home cards are rendered as children
    // If we should display the card we simply do not render children
    if (!displayCard) {
      return children;
    }
    return (
      <SetRecommendationImportance id={recID}>
        {({ setImportance }) => (
          <SaveEnrollment
            onCompleted={data => {
              if (data.upsertHealthInformation.didEnroll === 'YES') {
                setImportance({
                  variables: {
                    importanceInput: {
                      recommendationID: recID,
                      importance: 'COVERED',
                    },
                  },
                });
              }
            }}
          >
            {this.renderExitCard}
          </SaveEnrollment>
        )}
      </SetRecommendationImportance>
    );
  }
}

export default HealthExit;
