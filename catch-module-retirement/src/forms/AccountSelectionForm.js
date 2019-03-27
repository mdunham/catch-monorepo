import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import { Box, ReduxRadioGroup } from '@catch/rio-ui-kit';

import { formName } from '../const';
import { PortfolioOption } from '../components';

export class AccountSelectionForm extends Component {
  static propTypes = {
    onSelectAccountType: PropTypes.func,
    accountTypes: PropTypes.object.isRequired,
    recommendedAccountType: PropTypes.string.isRequired,
    selectedAccountType: PropTypes.string.isRequired,
    infoComponent: PropTypes.node,
    viewport: PropTypes.string,
    isMobile: PropTypes.bool,
  };

  render() {
    const {
      onSelectAccountType,
      accountTypes,
      recommendedAccountType,
      selectedAccountType,
      infoComponent,
      viewport,
      isMobile,
    } = this.props;

    return (
      <Field name="accountType" component={ReduxRadioGroup}>
        <PortfolioOption
          key="ROTH_IRA"
          recommended={'ROTH_IRA' === recommendedAccountType}
          isChecked={selectedAccountType && selectedAccountType === 'ROTH_IRA'}
          value="ROTH_IRA"
          mb={2}
          onSelectAccountType={onSelectAccountType}
          tooltip={infoComponent}
          viewport={viewport}
          isMobile={isMobile}
          {...accountTypes['ROTH_IRA']}
        />
        <PortfolioOption
          key="IRA"
          recommended={'IRA' === recommendedAccountType}
          isChecked={selectedAccountType && selectedAccountType === 'IRA'}
          value="IRA"
          mb={2}
          onSelectAccountType={onSelectAccountType}
          tooltip={infoComponent}
          viewport={viewport}
          isMobile={isMobile}
          {...accountTypes['IRA']}
        />
      </Field>
    );
  }
}

export default reduxForm({
  form: formName,
  destroyOnMount: false,
  enableReinitialize: true,
  forceUnregisterOnUnmount: true,
})(AccountSelectionForm);
