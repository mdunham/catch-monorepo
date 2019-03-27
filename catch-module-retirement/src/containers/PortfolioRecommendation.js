import React from 'react';
import { array, bool, func, number, oneOfType, string } from 'prop-types';

import { calculatePortfolioLevel } from '@catch/utils';

export const PortfolioRecommendation = ({
  age,
  children,
  riskComfort,
  riskLevel,
  loading,
  portfolios,
}) => {
  if (loading) return null;

  const recommendedPortfolioLevel = calculatePortfolioLevel({
    riskComfort,
    riskLevel,
    age,
  });

  const recommendedPortfolio = portfolios.find(
    p => p.name === recommendedPortfolioLevel,
  );

  return children({ recommendedPortfolioLevel, recommendedPortfolio });
};

PortfolioRecommendation.propTypes = {
  age: oneOfType([string, number]).isRequired,
  children: func.isRequired,
  riskComfort: string.isRequired,
  riskLevel: string.isRequired,
  loading: bool,
  portfolios: array.isRequired,
};

export default PortfolioRecommendation;
