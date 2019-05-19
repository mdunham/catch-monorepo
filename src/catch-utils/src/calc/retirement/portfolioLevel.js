const RISK_LEVELS = {
  AGGRESSIVE: 'AGGRESSIVE',
  MODERATE: 'MODERATE',
  CONSERVATIVE: 'CONSERVATIVE',
};

const RISK_COMFORT_LEVELS = {
  MORE_RISKY: 'MORE_RISKY',
  NEUTRAL: 'NEUTRAL',
  LESS_RISKY: 'LESS_RISKY',
};

export const PORTFOLIO_LEVELS = {
  conservative: 'Conservative',
  moderate: 'Moderate',
  aggressive: 'Aggressive',
};

export const AGE_LEVELS = {
  HIGH: 'HIGH',
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
};

export const RECOMMENDATION_MAP = {
  HIGH: {
    MORE_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.aggressive,
      MODERATE: PORTFOLIO_LEVELS.aggressive,
      CONSERVATIVE: PORTFOLIO_LEVELS.aggressive,
    },
    NEUTRAL: {
      AGGRESSIVE: PORTFOLIO_LEVELS.aggressive,
      MODERATE: PORTFOLIO_LEVELS.aggressive,
      CONSERVATIVE: PORTFOLIO_LEVELS.aggressive,
    },
    LESS_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.aggressive,
      MODERATE: PORTFOLIO_LEVELS.moderate,
      CONSERVATIVE: PORTFOLIO_LEVELS.moderate,
    },
  },
  MEDIUM: {
    MORE_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.aggressive,
      MODERATE: PORTFOLIO_LEVELS.moderate,
      CONSERVATIVE: PORTFOLIO_LEVELS.moderate,
    },
    NEUTRAL: {
      AGGRESSIVE: PORTFOLIO_LEVELS.moderate,
      MODERATE: PORTFOLIO_LEVELS.moderate,
      CONSERVATIVE: PORTFOLIO_LEVELS.moderate,
    },
    LESS_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.moderate,
      MODERATE: PORTFOLIO_LEVELS.moderate,
      CONSERVATIVE: PORTFOLIO_LEVELS.conservative,
    },
  },
  LOW: {
    MORE_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.moderate,
      MODERATE: PORTFOLIO_LEVELS.moderate,
      CONSERVATIVE: PORTFOLIO_LEVELS.conservative,
    },
    NEUTRAL: {
      AGGRESSIVE: PORTFOLIO_LEVELS.conservative,
      MODERATE: PORTFOLIO_LEVELS.conservative,
      CONSERVATIVE: PORTFOLIO_LEVELS.conservative,
    },
    LESS_RISKY: {
      AGGRESSIVE: PORTFOLIO_LEVELS.conservative,
      MODERATE: PORTFOLIO_LEVELS.conservative,
      CONSERVATIVE: PORTFOLIO_LEVELS.conservative,
    },
  },
};

export function calcAgeSuggestion({ age }) {
  if (age < 18) throw new Error('age must be 18 or over');
  if (age >= 18 && age <= 31) return 'HIGH';
  if (age >= 32 && age <= 49) return 'MEDIUM';
  if (age >= 50) return 'LOW';
}

export function calculatePortfolioLevel({ age, riskComfort, riskLevel }) {
  if (age && riskComfort && riskLevel) {
    return RECOMMENDATION_MAP[calcAgeSuggestion({ age })][riskComfort][
      riskLevel
    ];
  } else {
    return RECOMMENDATION_MAP[calcAgeSuggestion({ age: 21 })]['MORE_RISKY'][
      'CONSERVATIVE'
    ];
  }
}
