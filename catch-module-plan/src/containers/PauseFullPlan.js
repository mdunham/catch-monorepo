import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

import { PLAN_STATUS } from './PlanStatus';

const Log = createLogger('toggle-full-plan');

export const PAUSE_PLAN = gql`
  mutation PauseAllGoals {
    pauseAllGoals
  }
`;

export const UNPAUSE_PLAN = gql`
  mutation UnpauseAllGoals {
    unpauseAllGoals
  }
`;

const mutations = {
  PAUSED: UNPAUSE_PLAN,
  ACTIVE: PAUSE_PLAN,
};

const PREFIX = 'catch.module.plan.PauseFullPlan';
// Counter intuitive due to the state update after the toast is popped
export const COPY = {
  ACTIVE: {
    title: <FormattedMessage id={`${PREFIX}.pausedToast.title`} />,
    msg: <FormattedMessage id={`${PREFIX}.pausedToast.msg`} />,
  },
  PAUSED: {
    title: <FormattedMessage id={`${PREFIX}.resumedToast.title`} />,
    msg: <FormattedMessage id={`${PREFIX}.resumedToast.msg`} />,
  },
};

export const PauseFullPlan = ({ children, currentStatus, popToast }) => {
  const toastMessages = COPY[currentStatus];
  Log.debug(currentStatus);
  return (
    <Mutation
      mutation={mutations[currentStatus]}
      onCompleted={() => popToast(toastMessages)}
      refetchQueries={[
        { query: PLAN_STATUS, variables: { periodFilter: 'ANY' } },
      ]}
    >
      {(toggleFullPlan, { loading, error }) => {
        if (loading) Log.debug('Toggling full plan');
        return children({ toggleFullPlan });
      }}
    </Mutation>
  );
};

PauseFullPlan.propTypes = {
  children: PropTypes.func.isRequired,
  currentStatus: PropTypes.string.isRequired,
  popToast: PropTypes.func.isRequired,
};

export default connect(
  undefined,
  toastActions,
)(PauseFullPlan);
