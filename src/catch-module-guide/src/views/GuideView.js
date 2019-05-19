import React from 'react';
import { View, ScrollView } from 'react-native';

import { Spinner } from '@catch/rio-ui-kit';
import { CalculateTaxes } from '@catch/taxes';

import { Recommendations, ActedOnUpdates } from '../containers';
import GuideIntroView from './GuideIntroView';
import GuideListView from './GuideListView';

class GuideView extends React.PureComponent {
  render() {
    const { push, componentId } = this.props;
    return (
      <CalculateTaxes>
        {({
          currentPaycheckPercentage,
          reccPaycheckPercentage,
          currentMonthlyContribution,
          reccMonthlyContribution,
          hasPercentageChanged,
          loading,
        }) => (
          // Very hacky way, the backend REALLY need to return
          // this to us someday
          <Recommendations hasTaxRateUpdates={hasPercentageChanged}>
            {({ hasFinished, list, workType, loading }) =>
              loading ? null : hasFinished ? (
                <ActedOnUpdates>
                  {({ setIsActedOn }) => (
                    <GuideListView
                      data={list}
                      push={push}
                      componentId={componentId}
                      setIsActedOn={setIsActedOn}
                      suggestedRate={reccPaycheckPercentage}
                      currentRate={currentPaycheckPercentage}
                      suggestedEstimate={reccMonthlyContribution}
                      currentEstimate={currentMonthlyContribution}
                    />
                  )}
                </ActedOnUpdates>
              ) : (
                <GuideIntroView push={push} componentId={componentId} />
              )
            }
          </Recommendations>
        )}
      </CalculateTaxes>
    );
  }
}

export default GuideView;
