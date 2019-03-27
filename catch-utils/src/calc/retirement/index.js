const DEFAULT = 120000;
const MARRIED = 199000;
const MARRIED_SEPARATELY = 10000;

export const INCOME_LEVELS = {
  default: DEFAULT,
  married: MARRIED,
  marriedSeparately: MARRIED_SEPARATELY,
  headOfHousehold: DEFAULT,
};

export const ACCOUNT_TYPES = {
  traditional: 'IRA',
  roth: 'ROTH_IRA',
};

export const calculateInitialPercentage = args => {
  if (args !== null && typeof args === 'object' && args.age !== undefined) {
    const { age } = args;
    if (age >= 50) {
      return 0.15;
    } else if (age >= 40) {
      return 0.12;
    } else if (age >= 30) {
      return 0.08;
    } else if (age >= 18) {
      return 0.05;
    } else {
      throw new Error('age must be over 18');
    }
  } else {
    throw new Error('age must be over 18');
  }
};

export const calculateAccountType = args => {
  const { filingStatus, income } = args;
  if (income > 0 && !!filingStatus) {
    if (filingStatus === 'HEAD' && income >= INCOME_LEVELS.headOfHousehold) {
      return ACCOUNT_TYPES.traditional;
    } else if (
      filingStatus === 'MARRIED_SEPARATELY' &&
      income >= INCOME_LEVELS.marriedSeparately
    ) {
      return ACCOUNT_TYPES.traditional;
    } else if (filingStatus === 'MARRIED' && income >= INCOME_LEVELS.married) {
      return ACCOUNT_TYPES.traditional;
    } else if (filingStatus === 'SINGLE' && income >= INCOME_LEVELS.default) {
      return ACCOUNT_TYPES.traditional;
    } else {
      return ACCOUNT_TYPES.roth;
    }
  } else {
    throw new Error(`${income} is not a valid income`);
  }
};

export { calculateRetirementIncome } from './calcRetirement.js';
export { calcAgeSuggestion, calculatePortfolioLevel } from './portfolioLevel';
