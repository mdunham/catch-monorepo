import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';

import { Spinner, styles } from '@catch/rio-ui-kit';

import { Percentage } from '@catch/utils';
import { GoalCardActive } from '../components';

// import { trackEvent } from 'modules/Analytics';

const PREFIX = 'catch.module.plan.PlanOverviewList';

class PlanActiveList extends Component {
  static propTypes = {
    goTo: PropTypes.func,
    taxGoal: PropTypes.object,
    retirementGoal: PropTypes.object,
    ptoGoal: PropTypes.object,
    kycStatus: PropTypes.string,
  };

  render() {
    const {
      goalStates,
      initialValuesLoading,
      goTo,
      kycStatus,
      viewport,
    } = this.props;

    const { tax, pto, retirement } = goalStates;

    const cards = [];

    if (!!tax && tax.status !== 'DRAFT') {
      cards.push({
        key: 'tax',
        qaName: 'viewTax',
        icon: 'tax',
        isProcessing: tax.isProcessing,
        title: <FormattedMessage id={`${PREFIX}.Taxes.title`} />,
        status: tax.status,
        balance: tax.availableBalance,
        percent: <Percentage whole>{tax.paycheckPercentage}</Percentage>,
        onClick: () => goTo(['/plan/taxes', '/overview']),
        viewport,
      });
    }
    if (!!retirement && retirement.status !== 'DRAFT') {
      cards.push({
        key: 'retirement',
        qaName: 'viewRetirement',
        icon: 'retirement',
        isProcessing: retirement.isProcessing,
        title: <FormattedMessage id={`${PREFIX}.Retirement.title`} />,
        status: retirement.status,
        balance: retirement.availableBalance,
        percent: <Percentage whole>{retirement.paycheckPercentage}</Percentage>,
        onClick: () => goTo(['/plan/retirement', '/overview']),
        viewport,
      });
    }
    if (!!pto && pto.status !== 'DRAFT') {
      cards.push({
        key: 'pto',
        qaName: 'viewTimeOff',
        icon: 'timeoff',
        isProcessing: pto.isProcessing,
        title: <FormattedMessage id={`${PREFIX}.Timeoff.title`} />,
        status: pto.status,
        balance: pto.availableBalance,
        percent: <Percentage whole>{pto.paycheckPercentage}</Percentage>,
        onClick: () => goTo(['/plan/timeoff', '/overview']),
        viewport,
      });
    }

    return initialValuesLoading ? (
      <Spinner />
    ) : (
      <View style={styles.get(['FullWidth', 'Row', 'Wrap', 'Flex1'])}>
        {cards.map((cardProps, i) => (
          <GoalCardActive {...cardProps} index={i} />
        ))}
      </View>
    );
  }
}

export default PlanActiveList;
