import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform } from 'react-native';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import access from 'safe-access';

import { styles, withDimensions } from '@catch/rio-ui-kit';
import { Env, goTo } from '@catch/utils';

import CatchUpTaxView from './CatchUpTaxView';
import CatchUpIntroView from './CatchUpIntroView';
import CatchUpTimeoffView from './CatchUpTimeoffView';
import CatchUpRetirementView from './CatchUpRetirementView';

export class CatchUpView extends React.Component {
  static propTypes = {
    toggleDeposit: PropTypes.func.isRequired,
    viewport: PropTypes.string,
    onDismiss: PropTypes.func,
  };

  static defaultProps = {
    step: false,
  };

  constructor(props) {
    super(props);

    this.goTo = goTo.bind(this);

    // Theres a scenario where a user would need to go back to Catch up flow from transfers flow
    // I'm aware setting state from props is far from ideal, but this was the easiest solution
    this.state = {
      config: props.step || null,
      goalType: props.goalType,
    };
  }

  handleDismiss = () => {
    Env.isNative ? this.goTo('/plan', {}, 'RESET') : this.props.onDismiss();
  };

  handleDeposit = ({ goalType, depositAmount }) => {
    Env.isNative
      ? this.goTo('/plan/transfer', {
          goalType,
          initialTransferAmount: depositAmount,
          transferType: 'deposit',
        })
      : this.props.toggleDeposit({
          goalType,
          initialTransferAmount: depositAmount,
        });
  };

  renderView = () => {
    const { breakpoints, viewport } = this.props;

    if (this.state.config) {
      switch (this.state.goalType) {
        case 'RETIREMENT':
          return (
            <CatchUpRetirementView
              onDismiss={this.handleDismiss}
              breakpoints={breakpoints}
              viewport={viewport}
              onDeposit={depositAmount =>
                this.handleDeposit({
                  goalType: 'RETIREMENT',
                  depositAmount,
                })
              }
            />
          );

        case 'PTO':
          return (
            <CatchUpTimeoffView
              onDismiss={this.handleDismiss}
              breakpoints={breakpoints}
              viewport={viewport}
              onDeposit={depositAmount =>
                this.handleDeposit({
                  goalType: 'PTO',
                  depositAmount,
                })
              }
            />
          );

        case 'TAX':
          return (
            <CatchUpTaxView
              onDismiss={this.handleDismiss}
              breakpoints={breakpoints}
              viewport={viewport}
              onDeposit={depositAmount =>
                this.handleDeposit({
                  goalType: 'TAX',
                  depositAmount,
                })
              }
            />
          );

        default:
          return null;
      }
    } else {
      return (
        <CatchUpIntroView
          breakpoints={breakpoints}
          viewport={viewport}
          goalType={this.state.goalType}
          onDismiss={this.handleDismiss}
          onNext={() =>
            this.setState({ config: true, goalType: this.state.goalType })
          }
        />
      );
    }
  };

  render() {
    return this.renderView();
  }
}

CatchUpView.defaultProps = {};

const withFormValues = connect(state => ({
  suggestedIncome: formValueSelector('SuggestedIncomeForm')(state, 'amount'),
}));

const enhance = compose(
  withDimensions,
  withFormValues,
);

const Component = enhance(CatchUpView);
Component.displayName = 'CatchUpView';

export default Component;
