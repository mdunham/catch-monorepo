import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Box, Text, Label } from '@catch/rio-ui-kit';
import { ActionableInfo } from '@catch/common';

import { OverviewDetailsModal } from '../containers';

const PREFIX = 'catch.module.retirement.OverviewDetailsView';
export const COPY = {
  'accountType.label': <FormattedMessage id={`${PREFIX}.accountType.label`} />,
  'portfolio.label': <FormattedMessage id={`${PREFIX}.portfolio.label`} />,
};

class OverviewDetailsView extends PureComponent {
  static propTypes = {
    accountType: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
      .isRequired,
    portfolioName: PropTypes.string.isRequired,
    portfolioID: PropTypes.string.isRequired,
  };

  state = {
    showModal: null,
  };

  openModal = modal => {
    this.setState({
      showModal: modal,
    });
  };

  closeModal = _ => {
    this.setState({
      showModal: null,
    });
  };

  render() {
    const { accountType, portfolioName, portfolioID, goTo } = this.props;

    return (
      <Box mt={2}>
        <Label mb={1}>{COPY['accountType.label']}</Label>
        <Text mb={2}>{accountType}</Text>

        <ActionableInfo
          value={portfolioName}
          label={COPY['portfolio.label']}
          mb={2}
          onPress={() => this.openModal('portfolio')}
        />

        {this.state.showModal && (
          <OverviewDetailsModal
            closeModal={this.closeModal}
            showModal={this.state.showModal}
            portfolioID={portfolioID}
            goTo={goTo}
          />
        )}
      </Box>
    );
  }
}

export default OverviewDetailsView;
