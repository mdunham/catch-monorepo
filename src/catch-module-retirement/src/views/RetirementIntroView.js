import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import { Box, CenterFrame, Spinner } from '@catch/rio-ui-kit';
import { PlanIntroView, HasBankLinked } from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';

import { RetirementGoal } from '../containers';

const PREFIX = 'catch.module.retirement.RetirementIntroView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  step1: <FormattedMessage id={`${PREFIX}.step1`} />,
  step2: <FormattedMessage id={`${PREFIX}.step2`} />,
  step3: <FormattedMessage id={`${PREFIX}.step3`} />,
  step4: <FormattedMessage id={`${PREFIX}.step4`} />,
};
const introCopy = {
  title: 'Planning for Retirement',
  introText:
    'Build the perfect plan so that you can enjoy today without having to worry about tomorrow.',
};

class RetirementIntroView extends React.Component {
  static propTypes = {
    ...navigationPropTypes,
  };
  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }
  handleNext = ({ hasBankLinked, hasValidSync }) => {
    // In native we go navigate to the native screen that contains the js
    // navigator for the plan flow
    const nextPath = Platform.select({
      web: '/plan/retirement/current-savings',
      default: '/plan/retirement',
    });
    if (hasBankLinked && hasValidSync) {
      this.goTo(nextPath);
    } else if (hasBankLinked) {
      this.goTo(['/me', '/accounts']);
    } else {
      this.goTo(['/link-bank'], { nextPath });
    }
  };
  render() {
    return (
      <HasBankLinked>
        {({ loading: loadingBanks, error, hasBankLinked, hasValidSync }) => (
          <RetirementGoal>
            {({ startedRetirementGoal, loading }) =>
              loading || loadingBanks ? (
                <CenterFrame>
                  <Spinner large />
                </CenterFrame>
              ) : (
                <PlanIntroView
                  planName="retirement"
                  title={COPY['title']}
                  introText={COPY['subtitle']}
                  step1Text={COPY['step1']}
                  step2Text={COPY['step2']}
                  step3Text={COPY['step3']}
                  step4Text={COPY['step4']}
                  hasBankLinked={hasBankLinked}
                  hasGoal={startedRetirementGoal}
                  onNext={() =>
                    this.handleNext({ hasBankLinked, hasValidSync })
                  }
                />
              )
            }
          </RetirementGoal>
        )}
      </HasBankLinked>
    );
  }
}

export default RetirementIntroView;
