import React from 'react';
import { func } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import RetirementFlow from './RetirementFlow';
import Portfolios from './Portfolios';
import PortfolioRecommendation from './PortfolioRecommendation';

const PREFIX = 'catch.module.retirement';

export const portfolioDetails = {
  // AGGRESSIVE
  Aggressive: {
    description: (
      <FormattedMessage
        id={`${PREFIX}.PortfolioSelectionView.aggressive.description`}
      />
    ),
    // stocks: (
    //   <FormattedMessage
    //     id={`${PREFIX}.PortfolioSelectionView.aggressive.stocks`}
    //   />
    // ),
    // bonds: (
    //   <FormattedMessage
    //     id={`${PREFIX}.PortfolioSelectionView.aggressive.bonds`}
    //   />
    // ),
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
    // stocks: (
    //   <FormattedMessage
    //     id={`${PREFIX}.PortfolioSelectionView.moderate.stocks`}
    //   />
    // ),
    // bonds: (
    //   <FormattedMessage
    //     id={`${PREFIX}.PortfolioSelectionView.moderate.bonds`}
    //   />
    // ),
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
    // stocks: (
    //   <FormattedMessage
    //     id={`${PREFIX}.PortfolioSelectionView.passive.stocks`}
    //   />
    // ),
    // bonds: (
    //   <FormattedMessage id={`${PREFIX}.PortfolioSelectionView.passive.bonds`} />
    // ),
    stocks: 40,
    bonds: 60,
  },
};

export const SelectPortfolio = ({ children, onCompleted }) => (
  <RetirementFlow onCompleted={onCompleted}>
    {flowProps => (
      <Portfolios>
        {portfolioProps => (
          <PortfolioRecommendation {...flowProps} {...portfolioProps}>
            {({ recommendedPortfolio }) => {
              const { formValues } = flowProps;
              const { portfolios } = portfolioProps;

              const selectedPortfolio = formValues
                ? formValues.portfolioID
                : recommendedPortfolio.id;

              const selectedPortfolioDetails =
                formValues && formValues.portfolioID
                  ? {
                      ...portfolioDetails[
                        portfolios.find(p => p.id === formValues.portfolioID)
                          .name
                      ],
                      ...portfolios.find(p => p.id === formValues.portfolioID),
                    }
                  : {
                      ...recommendedPortfolio,
                      ...portfolioDetails[recommendedPortfolio.name],
                    };

              return children({
                // details for all portfolios
                allPortfolioDetails: portfolioDetails,

                // the user's recommended portfolio
                recommendedPortfolio,

                // the currently selected portfolio
                selectedPortfolio,

                // the currently selected portfolio's details
                selectedPortfolioDetails,

                // props from RetirementFlow
                ...flowProps,

                // props from Portfolios
                ...portfolioProps,

                loading: portfolioProps.loading || flowProps.loading,
              });
            }}
          </PortfolioRecommendation>
        )}
      </Portfolios>
    )}
  </RetirementFlow>
);

SelectPortfolio.propTypes = {
  children: func.isRequired,
};

export default SelectPortfolio;
