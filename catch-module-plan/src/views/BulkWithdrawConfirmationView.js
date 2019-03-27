import React, { Component } from 'react';
import { bool, func, number, object, oneOfType, string } from 'prop-types';

import { Box, Text, colors } from '@catch/rio-ui-kit';
import {
  WithdrawalConfirmLayout,
  VerticalRow,
  LinkedAccountsModule,
} from '@catch/common';

class BulkWithdrawConfirmationView extends Component {
  static propTypes = {
    amountToWithdraw: oneOfType([number, string]).isRequired,
    formValues: object,
    isFormValid: bool,
    onBack: func.isRequired,
    onWithdraw: func.isRequired,
  };

  state = { isWithdrawing: false };

  handleWithdrawal = async () => {
    try {
      this.setState({ isWithdrawing: true });
      await this.props.onWithdraw();
      this.setState({ isWithdrawing: false });
    } catch (e) {
      this.setState({ isWithdrawing: false });
    }
  };

  render() {
    const {
      amountToWithdraw,
      formValues,
      isFormValid,
      onBack,
      breakpoints,
    } = this.props;

    return (
      <WithdrawalConfirmLayout
        breakpoints={breakpoints}
        amountToWithdraw={amountToWithdraw}
        isLoading={this.state.isWithdrawing}
        onBack={onBack}
        onNext={this.handleWithdrawal}
        withdrawalRows={
          <Box>
            {formValues.taxBalance > 0 && (
              <VerticalRow label="Taxes" amount={formValues.taxBalance} />
            )}

            {formValues.ptoBalance > 0 && (
              <VerticalRow label="Time Off" amount={formValues.ptoBalance} />
            )}
          </Box>
        }
        sendView={
          <LinkedAccountsModule
            render={({ primaryAccount }) => {
              return (
                <Box mt={1}>
                  <Text weight="medium">
                    {!!primaryAccount && primaryAccount.name}
                  </Text>
                </Box>
              );
            }}
          />
        }
      />
    );
  }
}

export default BulkWithdrawConfirmationView;
