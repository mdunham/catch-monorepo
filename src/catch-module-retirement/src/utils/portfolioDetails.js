import React from 'react';
import { FormattedMessage } from 'react-intl';

const PREFIX = 'catch.module.retirement';

export const portfolioDetails = {
  // AGGRESSIVE
  Aggressive: {
    description: (
      <FormattedMessage
        id={`${PREFIX}.PortfolioSelectionView.aggressive.description`}
      />
    ),
    stocks: 80,
    bonds: 20,
  },
  // MODERATE
  Moderate: {
    description: (
      <FormattedMessage
        id={`${PREFIX}.PortfolioSelectionView.moderate.description`}
      />
    ),
    stocks: 60,
    bonds: 40,
  },
  // CONSERVATIVE/PASSIVE
  Conservative: {
    description: (
      <FormattedMessage
        id={`${PREFIX}.PortfolioSelectionView.passive.description`}
      />
    ),
    stocks: 40,
    bonds: 60,
  },
};

export default portfolioDetails;
