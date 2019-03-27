import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import access from 'safe-access';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import {
  convertUnixTimeToAge,
  calculateRetirementIncome,
  precisionRound,
} from '@catch/utils';

const INTEREST_RATES = {
  Conservative: 0.06,
  Moderate: 0.07,
  Aggressive: 0.08,
};

export const CATCH_UP_RETIREMENT = gql`
  query CatchUpRetirement {
    viewer {
      user {
        id
        dob
      }
      retirementGoal {
        id
        portfolio {
          name
        }
      }
    }
  }
`;

export const CatchUpRetirement = ({ children, depositAmount = 100 }) => (
  <Query query={CATCH_UP_RETIREMENT}>
    {({ data, loading, error }) => {
      const dob = access(data, 'viewer.user.dob');
      const age = convertUnixTimeToAge(dob);

      // Aggressive, Moderate, Conservative
      const portfolioName = access(
        data,
        'viewer.retirementGoal.portfolio.name',
      );

      const retirementCalculations = calculateRetirementIncome({
        initialAmount: depositAmount,
        currentAge: age,
        monthlyPayment: 0,
        retirementAge: 65,
        interestRate: INTEREST_RATES[portfolioName],
      });

      const projectedValue = precisionRound(
        access(retirementCalculations, 'totalSaved'),
        2,
      );

      return children({
        loading,
        error,
        projectedValue,
        depositAmount,
      });
    }}
  </Query>
);

CatchUpRetirement.propTypes = {
  children: PropTypes.func.isRequired,
  depositAmount: PropTypes.number,
};

const withDepositAmount = connect(state => ({
  depositAmount: formValueSelector('DepositAmount')(state, 'depositAmount'),
}));

const Component = withDepositAmount(CatchUpRetirement);
Component.displayName = 'CatchUpRetirement';

export default Component;
