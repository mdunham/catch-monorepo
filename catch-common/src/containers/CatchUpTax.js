import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { getEstimatedTaxCalcs } from '../utils';

export const CATCH_UP_TAX = gql`
  query CatchUpTax {
    viewer {
      taxGoal {
        id
        paycheckPercentage
      }
      income {
        estimated1099Income
      }
      user {
        id
        workType
      }
    }
  }
`;

export const CatchUpTax = ({ children, formValue }) => (
  <Query query={CATCH_UP_TAX}>
    {({ loading, error, data }) => {
      const paycheckPercentage = access(
        data,
        'viewer.taxGoal.paycheckPercentage',
      );

      const workType = access(data, 'viewer.user.workType');
      const estimated1099Income = access(
        data,
        'viewer.income.estimated1099Income',
      );

      const {
        amountOwedThisQuarter,
        amountOwedNow,
        quarterStartDate,
        thisQuarter,
        projectedAmountEarned,
        expectedIncomeThisQuarter,
      } = getEstimatedTaxCalcs(
        formValue,
        estimated1099Income,
        paycheckPercentage,
      );

      return children({
        loading,
        error,
        paycheckPercentage,
        amountOwedThisQuarter,
        amountOwedNow,
        workType,
        estimated1099Income,
        quarterStartDate,
        thisQuarter,
        projectedAmountEarned,
        expectedIncomeThisQuarter,
      });
    }}
  </Query>
);

CatchUpTax.propTypes = {
  children: PropTypes.func.isRequired,
};

const withFormValue = connect(state => ({
  formValue: formValueSelector('SuggestedIncomeForm')(state, 'amount'),
}));

const Component = withFormValue(CatchUpTax);
Component.displayName = 'CatchUpTax';

export default Component;
