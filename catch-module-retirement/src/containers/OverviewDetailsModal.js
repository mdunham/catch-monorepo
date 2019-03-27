import React from 'react';
import PropTypes from 'prop-types';

import { Spinner } from '@catch/rio-ui-kit';

import PortfolioDetails from './PortfolioDetails';

export const OverviewDetailsModal = ({
  closeModal,
  showModal,
  portfolioID,
  goTo,
}) => {
  switch (showModal) {
    case 'portfolio':
      return (
        <PortfolioDetails
          portfolioID={portfolioID}
          closeModal={closeModal}
          goTo={goTo}
        />
      );

    // PLACEHOLDER: will add beneficiary once backend is fleshed out
    case 'beneficiary':
    default:
      return null;
  }
};

OverviewDetailsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  showModal: PropTypes.string.isRequired,
  portfolioID: PropTypes.string.isRequired,
  goTo: PropTypes.func.isRequired,
};

export default OverviewDetailsModal;
