import gql from 'graphql-tag';
import { connect } from 'react-redux';
import { withApollo, compose, graphql } from 'react-apollo';
import { mapProps } from 'recompose';
import { getFormValues } from 'redux-form';

import Log from '@catch/utils';
import { toastActions, withError, withLoading } from '@catch/errors';

import Component from './Component';
import { ACTIVE_GOALS, BULK_WITHDRAW } from '../../store/endpoints';
import { formName } from './constants';

/**
 * HOC that adds results of ACTIVE_GOALS query as props to Component (data.viewer)
 */
const withGoals = graphql(ACTIVE_GOALS, {
  props: ({ ownProps, data: { loading, error, ...rest } }) => ({
    initialValuesLoading: loading,
    initialValuesError: error,
    ...rest,
    ...ownProps,
  }),
});

const withBulkWithdraw = graphql(BULK_WITHDRAW, {
  props: ({ mutate }) => ({
    // named func gets passed to component as prop
    onWithdraw: ({ withdrawals }) => {
      return mutate({ variables: { input: withdrawals } });
    },
  }),
});

const withRedux = connect(
  state => ({
    formValues: getFormValues(formName)(state),
  }),
  toastActions,
);

const enhance = compose(
  withApollo,
  withGoals,
  withBulkWithdraw,
  withRedux,
);

export default enhance(Component);

export { formName };
