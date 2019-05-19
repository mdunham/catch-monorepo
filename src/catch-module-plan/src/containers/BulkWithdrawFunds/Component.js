import React, { Component } from 'react';
import { bool, func, object } from 'prop-types';
import { Platform } from 'react-native';
import { FormattedMessage } from 'react-intl';
import { createLogger, goTo } from '@catch/utils';

const Log = createLogger('bulk-withdraw-funds');

const STAGES = {
  fillingIn: 'fillingIn',
  confirmation: 'confirmation',
  success: 'success',
  error: 'error',
};

class BulkWithdrawFunds extends Component {
  static propTypes = {
    children: func.isRequired,
    formValues: object,
    initialValuesError: object,
    initialValuesLoading: bool.isRequired,
    onWithdraw: func.isRequired,
    viewer: object,
  };

  state = { currentStage: STAGES.fillingIn };

  constructor(props) {
    super(props);
    this.goTo = goTo.bind(this);
  }

  handleWithdrawal = async () => {
    const {
      formValues,
      viewer: { ptoGoal, taxGoal },
      onWithdraw,
    } = this.props;
    try {
      let withdrawals = [];

      if (!!taxGoal && !!formValues.taxBalance && formValues.taxBalance > 0) {
        withdrawals.push({
          goalID: taxGoal.id,
          goalType: 'TAX',
          amount: parseFloat(formValues.taxBalance),
        });
      }

      if (!!ptoGoal && !!formValues.ptoBalance && formValues.ptoBalance > 0) {
        withdrawals.push({
          goalID: ptoGoal.id,
          goalType: 'PTO',
          amount: parseFloat(formValues.ptoBalance),
        });
      }

      const response = await onWithdraw({ withdrawals });
      this.handleSuccess();
      Log.debug(response);
      return response;
    } catch (e) {
      Log.error(e);
      this.setState({ currentStage: STAGES.error });
    }
  };

  handleSuccess = () => {
    if (Platform.OS === 'web') {
      this.setState({ currentStage: STAGES.success });
    } else {
      this.props.popToast({
        type: 'success',
        title: (
          <FormattedMessage id="catch.util.withdraw.WithdrawGoalSuccessView.title" />
        ),
        msg: (
          <FormattedMessage id="catch.util.withdraw.WithdrawGoalSuccessView.description" />
        ),
      });
      this.goTo(['/plan']);
    }
  };

  /*
   * util to set currentStage
   */
  setStage = ({ stage }) => {
    this.setState({ currentStage: stage });
  };

  /*
   * calculate the total withdrawal amount from all goals
   */
  calcWithdrawalTotal = () => {
    if (!!this.props.formValues) {
      const {
        formValues: { taxBalance, ptoBalance, retirementBalance },
      } = this.props;

      const total =
        (!!ptoBalance && ptoBalance > 0 ? parseFloat(ptoBalance) : 0) +
        (!!taxBalance && taxBalance > 0 ? parseFloat(taxBalance) : 0) +
        (!!retirementBalance && retirementBalance > 0
          ? parseFloat(retirementBalance)
          : 0);

      return total;
    }
  };

  /*
   * calculate the total available amount to withdraw
   * used to validate button on config view
   */
  calcAvailableTotal = () => {
    const {
      viewer: { ptoGoal, retirementGoal, taxGoal },
    } = this.props;

    let values = [];
    if (!!ptoGoal) values.push(parseFloat(ptoGoal.availableBalance));
    if (!!retirementGoal)
      values.push(parseFloat(retirementGoal.availableBalance));
    if (!!taxGoal) values.push(parseFloat(taxGoal.availableBalance));

    return values.reduce((a, b) => a + b, 0);
  };

  render() {
    const {
      children,
      formValues,
      initialValuesError,
      initialValuesLoading,
      viewer,
    } = this.props;

    const { taxGoal, retirementGoal, ptoGoal } = viewer || {};

    const availableBalances = {
      ptoBalance: !!ptoGoal && ptoGoal.availableBalance,
      retirementBalance: !!retirementGoal && retirementGoal.availableBalance,
      taxBalance: !!taxGoal && taxGoal.availableBalance,
    };

    let areFormEntriesValid = {};

    if (!!taxGoal) {
      areFormEntriesValid.tax =
        !!availableBalances.taxBalance &&
        !!formValues &&
        formValues.taxBalance <= availableBalances.taxBalance;
    }

    if (!!ptoGoal) {
      areFormEntriesValid.pto =
        !!availableBalances.ptoBalance &&
        !!formValues &&
        formValues.ptoBalance <= availableBalances.ptoBalance;
    }

    if (initialValuesLoading || initialValuesError) {
      return children({ initialValuesLoading, initialValuesError });
    }

    return children({
      initialValuesError,
      initialValuesLoading,
      availableBalances,
      areFormEntriesValid,
      currentStage: this.state.currentStage,
      formValues,
      handleWithdrawal: this.handleWithdrawal,
      isTotalValid: this.calcWithdrawalTotal() <= this.calcAvailableTotal(),
      onSetStage: this.setStage,
      totalToWithdraw: this.calcWithdrawalTotal() || 0,
      STAGES,
    });
  }
}

export default BulkWithdrawFunds;
