import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Platform } from 'react-native';

import { PlanIntroView, HasBankLinked } from '@catch/common';
import { goTo, navigationPropTypes } from '@catch/utils';
import { Spinner, CenterFrame } from '@catch/rio-ui-kit';

import { TaxGoal } from '../containers';

const PREFIX = 'catch.module.taxes.TaxesIntroView';
export const COPY = {
  title: <FormattedMessage id={`${PREFIX}.title`} />,
  subtitle: <FormattedMessage id={`${PREFIX}.subtitle`} />,
  step1: <FormattedMessage id={`${PREFIX}.step1`} />,
  step2: <FormattedMessage id={`${PREFIX}.step2`} />,
  step3: <FormattedMessage id={`${PREFIX}.step3`} />,
  step4: <FormattedMessage id={`${PREFIX}.step4`} />,
};

class TaxesIntroView extends React.Component {
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
      web: '/plan/taxes/estimator',
      default: '/plan/taxes',
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
        {({ loading, error, hasBankLinked, hasValidSync }) => (
          <TaxGoal>
            {({ taxGoal, loading: loadingTaxGoal }) =>
              loading || loadingTaxGoal ? (
                <CenterFrame>
                  <Spinner large />
                </CenterFrame>
              ) : (
                <PlanIntroView
                  planName="tax"
                  title={COPY['title']}
                  introText={COPY['subtitle']}
                  step1Text={COPY['step1']}
                  step2Text={COPY['step2']}
                  step3Text={COPY['step3']}
                  step4Text={COPY['step4']}
                  hasBankLinked={hasBankLinked}
                  hasGoal={!!taxGoal}
                  onNext={() =>
                    this.handleNext({ hasBankLinked, hasValidSync })
                  }
                />
              )
            }
          </TaxGoal>
        )}
      </HasBankLinked>
    );
  }
}

export default TaxesIntroView;
