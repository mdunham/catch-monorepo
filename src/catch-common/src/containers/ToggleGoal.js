import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { createLogger } from '@catch/utils';
import { toastActions } from '@catch/errors';

const Log = createLogger('toggle-goal');

const PREFIX = 'catch.plans.ToggleGoal';
export const COPY = {
  PAUSED: {
    title: values => (
      <FormattedMessage id={`${PREFIX}.pausedToast.title`} values={values} />
    ),
    msg: values => (
      <FormattedMessage id={`${PREFIX}.pausedToast.msg`} values={values} />
    ),
  },
  ACTIVE: {
    title: values => (
      <FormattedMessage id={`${PREFIX}.resumedToast.title`} values={values} />
    ),
    msg: values => (
      <FormattedMessage id={`${PREFIX}.resumedToast.msg`} values={values} />
    ),
  },
};

export const TOGGLE_TAX = gql`
  mutation ToggleTax($input: TaxGoalInput!) {
    upsertTaxGoal(input: $input) {
      id
      status
    }
  }
`;

export const TOGGLE_PTO = gql`
  mutation TogglePTO($input: PTOGoalInput!) {
    upsertPTOGoal(input: $input) {
      id
      status
    }
  }
`;

export const TOGGLE_RETIREMENT = gql`
  mutation ToggleRetirement($input: RetirementGoalInput!) {
    upsertRetirementGoal(input: $input) {
      id
      status
    }
  }
`;

const mutations = {
  tax: TOGGLE_TAX,
  pto: TOGGLE_PTO,
  retirement: TOGGLE_RETIREMENT,
};

export const ToggleGoal = ({
  children,
  goalName,
  goalType,
  popToast,
  currentStatus,
  onCompleted,
  toastEnabled,
}) => (
  <Mutation
    mutation={mutations[goalType]}
    onCompleted={() => {
      if (toastEnabled) {
        popToast({
          type: 'success',
          title: COPY[currentStatus]['title']({ goalName }),
          msg: COPY[currentStatus]['msg']({ goalName }),
        });
      }
      if (onCompleted) onCompleted();
    }}
  >
    {(toggleGoal, { loading, error }) => {
      if (loading) Log.debug(`Toggling ${goalType} goal`);
      return children({ toggleGoal, loading });
    }}
  </Mutation>
);

ToggleGoal.propTypes = {
  children: PropTypes.func.isRequired,
  goalType: PropTypes.string.isRequired,
  popToast: PropTypes.func.isRequired,
  toastEnabled: PropTypes.bool,
  onCompleted: PropTypes.func,
};

ToggleGoal.defaultProps = {
  toastEnabled: true,
};

export default connect(
  undefined,
  toastActions,
)(ToggleGoal);
